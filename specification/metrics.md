# QoE Metrics

This document defines a shared set of Quality-of-Experience (QoE) metrics computed from EPAS
events, together with a runnable reference query for each. The goal is that every consumer
(dashboards, SQL-access examples, self-hosters) computes the same metric the same way, so the
same data produces the same numbers.

The specification itself defines only the [events](README.md) and their flow. The metrics below
are derived from those events; they are reference definitions, not part of the event schema.

## Stored table

The queries target the stored table written by the worker through
[`player-analytics-shared`](https://github.com/Eyevinn/player-analytics-shared)'s
`ClickHouseDBAdapter` (v0.10.1). The table is named `epas_<shardId>` (one table per shard) and
has these columns:

| Column | Notes |
|--------|-------|
| `event` | The event name, e.g. `init`, `loading`, `loaded`, `playing`, `buffering`, `buffered`, `stopped`, `error`, `heartbeat`. See the [event list](README.md#events). |
| `sessionId` | Unique id of a viewing session. |
| `timestamp` | UTC time of the event, in **milliseconds** since the Unix epoch (the `timestamp` field of every event). |
| `playhead` | Playhead position of the event. |
| `duration` | Content duration reported with the event. |
| `live` | Whether the session is live (derived from `metadata`). |
| `contentId` | Content identifier (derived). |
| `userId` | User identifier (derived). |
| `deviceId` | Device identifier (derived). |
| `deviceModel` | Device model (derived). |
| `deviceType` | Device type (derived). |
| `payload` | The event `payload`, stored as a **JSON string**. Read fields with ClickHouse `JSONExtract*` functions, e.g. `JSONExtractString(payload, 'reason')`. |
| `event_date` | Partition helper derived from `timestamp`. |
| `event_hour` | Partition helper derived from `timestamp`. |

Replace `epas_<shardId>` with the concrete table name for your shard before running a query. All
queries are ClickHouse SQL. `timestamp` is treated as epoch milliseconds throughout, so all
durations below are in milliseconds unless stated otherwise.

A **view** is the fundamental unit for most metrics and is defined first; the other metrics are
expressed relative to it.

## 1. View

**Definition.** A view is a viewing session that contains at least one `init` event. `init` is
sent once per session when the client decides to start a viewing session, so it is the most
reliable marker that a session exists. Sessions with no `init` (for example stray or malformed
events) are not counted as views.

```sql
SELECT count(DISTINCT sessionId) AS views
FROM epas_<shardId>
WHERE event = 'init';
```

## 2. View in progress

**Definition.** A view that is still ongoing. Rather than defining "in progress" as "has no
`stopped` yet" (some SDKs never send a valid `stopped`, so those sessions would appear to run
forever), it is defined by a time window tied to the heartbeat cadence: a view is in progress if
its most recent event is within **2× the largest heartbeat interval** of now. The heartbeat
interval is measured as the largest gap observed between consecutive `heartbeat` events; doubling
it tolerates a single missed heartbeat before a session is considered to have ended.

```sql
WITH
    hb_gaps AS (
        SELECT
            timestamp - lagInFrame(timestamp) OVER (
                PARTITION BY sessionId ORDER BY timestamp
            ) AS gap
        FROM epas_<shardId>
        WHERE event = 'heartbeat'
    ),
    -- 2x the largest heartbeat interval observed, in milliseconds
    window_ms AS (
        SELECT 2 * max(gap) AS w
        FROM hb_gaps
        WHERE gap > 0
    ),
    views AS (
        SELECT DISTINCT sessionId
        FROM epas_<shardId>
        WHERE event = 'init'
    )
SELECT
    sessionId,
    max(timestamp) AS last_event_ts
FROM epas_<shardId>
WHERE sessionId IN (SELECT sessionId FROM views)
GROUP BY sessionId
HAVING toUnixTimestamp64Milli(now64(3)) - last_event_ts <= (SELECT w FROM window_ms);
```

> Note: if the dataset contains no `heartbeat` events, `window_ms.w` is empty and no session is
> reported as in progress. Substitute a fixed window (e.g. the agreed heartbeat interval) if your
> deployment does not emit heartbeats.

## 3. Startup time

**Definition.** The time from the player attaching the content (`loading`) to it being ready to
play (`loaded`), per session. Both events are sent once per session. Startup time is the
difference `loaded.timestamp - loading.timestamp`. Reported as the median (p50) and 95th
percentile (p95) across all sessions that have both events.

```sql
WITH per_session AS (
    SELECT
        sessionId,
        minIf(timestamp, event = 'loading') AS t_loading,
        minIf(timestamp, event = 'loaded')  AS t_loaded
    FROM epas_<shardId>
    GROUP BY sessionId
    HAVING t_loading > 0 AND t_loaded > 0 AND t_loaded >= t_loading
)
SELECT
    quantileExact(0.50)(t_loaded - t_loading) AS startup_p50_ms,
    quantileExact(0.95)(t_loaded - t_loading) AS startup_p95_ms
FROM per_session;
```

## 4. Rebuffer

**Definition.** A rebuffer is an involuntary stall during playback: a `buffering` event that
occurs **after the session's first `playing`** event. Buffering that happens before the first
`playing` is part of initial startup, not a rebuffer, and is excluded. Buffering caused by
seeking or loading is already excluded at the client per the event spec.

**Pairing rule for repeated `buffering` events.** A single stall can surface as several
`buffering` events before the matching `buffered`. To avoid over-counting, a `buffering` event
starts a new rebuffer only when the preceding buffering-state event for that session was a
`buffered` (or there was none). In other words, consecutive `buffering` events with no `buffered`
between them collapse into one rebuffer; the rebuffer is considered closed by the next `buffered`.

Reported as the percentage of views that had at least one rebuffer, and the mean number of
rebuffers per view.

```sql
WITH
    first_play AS (
        SELECT sessionId, min(timestamp) AS t_first_play
        FROM epas_<shardId>
        WHERE event = 'playing'
        GROUP BY sessionId
    ),
    -- buffering/buffered events after the first playing, with the previous one in the stream
    buf_stream AS (
        SELECT
            e.sessionId AS sessionId,
            e.event     AS event,
            lagInFrame(e.event, 1, '') OVER (
                PARTITION BY e.sessionId ORDER BY e.timestamp
            ) AS prev_event
        FROM epas_<shardId> AS e
        INNER JOIN first_play AS fp ON fp.sessionId = e.sessionId
        WHERE e.event IN ('buffering', 'buffered')
          AND e.timestamp >= fp.t_first_play
    ),
    rebuffers_per_session AS (
        SELECT
            sessionId,
            countIf(event = 'buffering' AND (prev_event = '' OR prev_event = 'buffered'))
                AS rebuffers
        FROM buf_stream
        GROUP BY sessionId
    ),
    views AS (
        SELECT DISTINCT sessionId
        FROM epas_<shardId>
        WHERE event = 'init'
    )
SELECT
    round(100 * countIf(coalesce(r.rebuffers, 0) > 0) / count(), 2)
        AS pct_views_with_rebuffering,
    avg(coalesce(r.rebuffers, 0)) AS rebuffers_per_view
FROM views AS v
LEFT JOIN rebuffers_per_session AS r ON r.sessionId = v.sessionId;
```

## 5. Playback failure

**Definition.** A view in which a fatal `error` event occurred. Per the event spec, an `error`
is a fatal error (a non-fatal one is a `warning`, which is not counted here). Reported as the
count and percentage of views that contain at least one `error`.

```sql
WITH views AS (
    SELECT DISTINCT sessionId
    FROM epas_<shardId>
    WHERE event = 'init'
)
SELECT
    countIf(sessionId IN (
        SELECT DISTINCT sessionId FROM epas_<shardId> WHERE event = 'error'
    )) AS views_with_failure,
    round(100 * countIf(sessionId IN (
        SELECT DISTINCT sessionId FROM epas_<shardId> WHERE event = 'error'
    )) / count(), 2) AS pct_views_with_failure
FROM views;
```

## 6. Exit before start

**Definition.** A view that had an `init` but never reached playback — no `playing` event was
received for the session. This captures abandonment during startup (including failures that stop
the session before the playhead ever moves). Reported as a count of views.

```sql
WITH
    views AS (
        SELECT DISTINCT sessionId
        FROM epas_<shardId>
        WHERE event = 'init'
    ),
    played AS (
        SELECT DISTINCT sessionId
        FROM epas_<shardId>
        WHERE event = 'playing'
    )
SELECT count() AS exit_before_start
FROM views AS v
WHERE v.sessionId NOT IN (SELECT sessionId FROM played);
```

## 7. End reason

**Definition.** How a view ended, read from `stopped.payload.reason` and normalised to a fixed
set: `ended | aborted | error | unknown | other`. The spec's documented reasons are `ended`,
`aborted`, `error` and `unknown`; a missing or empty reason is treated as `unknown`, and any
other free-text value is bucketed as `other`. When a session has more than one `stopped` event,
the reason of the latest one (by `timestamp`) is used.

```sql
SELECT
    multiIf(
        reason IN ('ended', 'aborted', 'error', 'unknown'), reason,
        reason = '', 'unknown',
        'other'
    ) AS end_reason,
    count() AS sessions
FROM (
    SELECT
        sessionId,
        argMax(JSONExtractString(payload, 'reason'), timestamp) AS reason
    FROM epas_<shardId>
    WHERE event = 'stopped'
    GROUP BY sessionId
)
GROUP BY end_reason
ORDER BY sessions DESC;
```

## Known SDK deviations

Some client SDKs currently emit events that deviate from the flow these metrics assume. Until the
issues below are resolved, the listed metrics may be skewed for sessions produced by the affected
SDK. Each link points to the tracking issue with the full detail.

**iOS / Swift SDK**

- [swift#40](https://github.com/Eyevinn/player-analytics-client-sdk-swift/issues/40) — `stopped`
  `payload.reason` is always null, so those stopped events are rejected. Affects **End reason**
  (metric 7) and the closing of a view.
- [swift#41](https://github.com/Eyevinn/player-analytics-client-sdk-swift/issues/41) — `metadata`
  is sent before `init` and reports `live: true` for VOD. Affects the `live` dimension of any
  metric and view ordering.
- [swift#42](https://github.com/Eyevinn/player-analytics-client-sdk-swift/issues/42) —
  `metadata.deviceType` reports the CPU architecture instead of a device type. Affects any
  breakdown by `deviceType`.
- [swift#43](https://github.com/Eyevinn/player-analytics-client-sdk-swift/issues/43) —
  `bitrate_changed` reports bps while the spec uses Kbps. Affects any bitrate-derived metric.

**Android SDK**

- [android#18](https://github.com/Eyevinn/player-analytics-client-sdk-android/issues/18) —
  `stopped` is sent twice per session. Affects **End reason** (metric 7); the reference query
  already de-duplicates by taking the latest `stopped` per session.
- [android#19](https://github.com/Eyevinn/player-analytics-client-sdk-android/issues/19) —
  start-up events are out of order (`playing` before `loaded` and sent twice, `buffered` after
  `playing`). Affects **Startup time** (metric 3) and **Rebuffer** (metric 4), which depend on
  `loading`→`loaded` ordering and on the first `playing`.
- [android#20](https://github.com/Eyevinn/player-analytics-client-sdk-android/issues/20) —
  `stopped` reason is free text instead of the EPAS values. Affects **End reason** (metric 7);
  such values fall into the `other` bucket.
