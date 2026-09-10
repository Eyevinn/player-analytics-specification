# Documentation audit

This audit enumerates concrete, repo-grounded documentation problems in this
specification repository. It exists to turn the vague parent request ("rewrite
the docs based on hackathon feedback") into a reviewable, splittable change list.

Every item below is grounded in what actually exists in this repo at the time of
writing. Where a claim cannot be verified from this repo alone (for example,
drift against an SDK that is not cloned here), it is listed as a *verification
follow-up* rather than asserted as fact.

Scope: this is enumeration only — no documentation is rewritten here. Each
checklist item is written to be independently implementable and reviewable, so
it can be split into its own follow-up issue.

Legend for affected files:
- `README.md` — repository root readme
- `specification/README.md` — the human-readable specification
- `specification/typescript/**` — the TypeScript source of truth for the schema
- `json/schema.json` — the generated JSON schema (`npm run json`)

---

## A. Schema-vs-docs discrepancies (docs disagree with the TypeScript source)

These are the highest priority: the prose disagrees with the actual typed
contract in `specification/typescript`, which is the source of truth the JSON
schema is generated from.

- [ ] **A1. `metadata` example is missing the `event` field.**
  - Affects: `specification/README.md` §Events → `#### metadata` (the two
    `jsonc` blocks).
  - Wrong today: both metadata JSON examples omit `event: "metadata"`, but
    `specification/typescript/event/metadata.d.ts` requires `event: "metadata"`
    and `json/schema.json` lists `event` in the metadata `required` set.
  - Proposed change: add `event: "metadata"` to both metadata examples so they
    are valid against the schema.

- [ ] **A2. `metadata` payload fields are under-documented.**
  - Affects: `specification/README.md` §Events → `#### metadata`.
  - Wrong today: the README documents only `live`, `contentTitle`, and
    `customMetadataId` in the metadata payload, but
    `metadata.d.ts` (`TMetadataEventPayload`) also defines `contentId`,
    `contentUrl`, `drmType`, `userId`, `deviceId`, `deviceModel`, and
    `deviceType` (all present in `json/schema.json`).
  - Proposed change: document each defined metadata payload field, or state
    explicitly which are illustrative vs. specified. Also document the
    `[key: string]: string | number | boolean` open-ended additional-properties
    behaviour, which is currently undocumented.

- [ ] **A3. `shardId` base field is undocumented.**
  - Affects: `specification/README.md` §Event flow → `### JSON Schema` and
    §Server-populated fields.
  - Wrong today: `specification/typescript/event/base.d.ts` (`TBaseEvent`)
    defines `shardId?: ShardId`, and it appears in every event in
    `json/schema.json`, but the README's base-event documentation never
    mentions it. Readers cannot tell what `shardId` is, who sets it, or whether
    it is client- or server-populated.
  - Proposed change: document `shardId` in the base-event section (purpose,
    who populates it, optionality), the same way `domain` is documented.

- [ ] **A4. `error` / `warning` `code` field is required but reads as optional.**
  - Affects: `specification/README.md` §Events → `#### error` and `#### warning`.
  - Wrong today: `error.d.ts` / `warning.d.ts` mark `code: string` as
    **required** (only `category`, `message`, `data` are optional), but the
    README examples show `code: ""` alongside optional-looking fields with no
    indication that `code` is mandatory.
  - Proposed change: annotate `code` as required in both examples (e.g. a
    comment), consistent with the type.

- [ ] **A5. `stopped` `reason` documented values are narrower than the type.**
  - Affects: `specification/README.md` §Events → `#### stopped`.
  - Wrong today: the README comment lists `"ended", "aborted", "error"`, while
    `stopped.d.ts` types `reason` as `"error" | "ended" | "aborted" | "unknown"
    | string`. The `"unknown"` named value is undocumented, and the fact that
    any string is accepted is not stated.
  - Proposed change: document the full set of named reasons (including
    `"unknown"`) and note that `reason` is an open string.

---

## B. Broken / malformed examples in the specification README

- [ ] **B1. `warning` example has invalid JSON syntax.**
  - Affects: `specification/README.md` §Events → `#### warning`.
  - Wrong today: the example contains `code ""` (missing colon after `code`),
    so the block is not valid JSON/JSONC. Compare the `error` example above it,
    which correctly writes `code: ""`.
  - Proposed change: fix to `code: "",`.

- [ ] **B2. Stray non-English words in the `warning` example.**
  - Affects: `specification/README.md` §Events → `#### warning`.
  - Wrong today: the comment on `category` reads `// eg. NETWORK, DECODER, osv.`
    ("osv." is Swedish for "etc."). The equivalent `error` example uses `etc.`.
  - Proposed change: replace `osv.` with `etc.` so the two examples match and
    the docs stay language-consistent.

- [ ] **B3. `seeked` example has a misplaced inline comment.**
  - Affects: `specification/README.md` §Events → `#### seeked`.
  - Wrong today: the comment `// the new playhead` is attached to the
    `timestamp` line, but the surrounding prose ("`playhead` MUST be the new
    playhead time") and the field it describes is `playhead`, not `timestamp`.
  - Proposed change: move the comment to the `playhead` line (or remove it).

---

## C. Naming / consistency drift within this repo

- [ ] **C1. Version header in the specification README is stale.**
  - Affects: `specification/README.md` line 1 (`# Version 0.2`) vs
    `package.json` (`"version": "0.6.0"`).
  - Wrong today: the specification document declares itself "Version 0.2" while
    the published package is `0.6.0`. Readers cannot tell which spec version the
    prose corresponds to.
  - Proposed change: reconcile the version header with the package version, or
    replace the hard-coded number with a clearly maintained versioning note.

- [ ] **C2. Module interface key names differ from event names.**
  - Affects: `README.md` / `specification/README.md` (there is no documentation
    of `PlayerAnalyticsClientModule` in prose at all) vs
    `specification/typescript/index.ts`.
  - Wrong today: `PlayerAnalyticsClientModule` exposes `pause` and
    `bitrateChanged` methods, while the corresponding events are `paused` and
    `bitrate_changed`. This mapping (method name -> event name) is undocumented,
    which is a likely integration pitfall.
  - Proposed change: add a short section documenting the client-module method
    surface and its mapping to event names, or align the naming and note the
    change.

- [ ] **C3. `TPlayerAnalyticsEvent` union / event list is not surfaced in docs.**
  - Affects: `specification/README.md` (event list) vs
    `specification/typescript/event/base.d.ts` (`TEventType`) and
    `index.ts` (`TPlayerAnalyticsEvent`).
  - Wrong today: the canonical machine-readable list of event types lives in
    `TEventType`, but the README relies on hand-maintained per-event sections
    with no cross-reference. There is nothing tying the prose list to the typed
    enum, so they can silently diverge (this audit is the manual check).
  - Proposed change: add a single authoritative event-type table in the README
    that mirrors `TEventType`, and note it must be kept in sync (or generate it).

---

## D. Getting-started / usage gaps in the root README

- [ ] **D1. "Using in a Project" references Deno with no supporting docs.**
  - Affects: `README.md` §Using in a Project.
  - Wrong today: the README says the spec "can be added as a direct dependency
    to a Node/Deno based project," but there is no Deno-specific guidance,
    example, or config anywhere in the repo; only an `npm i` line is given.
  - Proposed change: either add a minimal Deno import example or drop the Deno
    claim until it is supported/verified.

- [ ] **D2. No end-to-end "first event" example.**
  - Affects: `README.md` (no such section exists) / `specification/README.md`.
  - Wrong today: there is no minimal, copy-pasteable getting-started example
    showing how to import the types and construct/send a first (e.g. `init`)
    event. A newcomer has to assemble this from the per-event `jsonc` blocks.
  - Proposed change: add a short getting-started snippet that imports from
    `@eyevinn/player-analytics-specification` and builds one valid event.

- [ ] **D3. Contributing steps reference scripts that need a documented workflow.**
  - Affects: `README.md` §Contributing vs `package.json` `scripts`.
  - Wrong today: Contributing tells contributors to run `npm run json` and
    `npm run typedoc` (both exist in `package.json`), but there is no documented
    verification/test step, and no `build` or `test` script exists — so a
    contributor cannot tell how docs changes are validated. The
    generated artifacts (`json/schema.json`, `docs/`) are committed, so a stale
    regeneration is easy to miss.
  - Proposed change: document that `json/schema.json` and `docs/` are generated
    artifacts and must be regenerated when the TypeScript source changes, and
    state explicitly that there is no automated test for the spec text.

---

## E. Generated-artifact hygiene

- [ ] **E1. `json/specification` is an unexplained generated dump.**
  - Affects: repo root `json/specification` (a large typedoc JSON project dump,
    committed with no file extension) and `README.md`/`package.json`.
  - Wrong today: `json/specification` is a committed generated file that no
    documentation explains — it is not referenced from any README, and it is
    unclear which command produces it or whether it is meant to be maintained.
  - Proposed change: document its origin/purpose, give it a proper extension if
    kept, or remove it if it is a stale artifact. (Confirm the producing command
    before deleting.)

---

## F. Cross-repo drift — verification follow-ups (NOT asserted here)

The specification is consumed by the web/android/swift SDKs and by eventsink and
the worker. Those repos are **not** present in this checkout, so the items below
are framed as verification tasks, not asserted drifts. Each should become its own
follow-up issue that actually inspects the named repo.

- [ ] **F1. Verify metadata payload fields against the SDKs.** Confirm that
  `contentId`, `contentUrl`, `drmType`, `userId`, `deviceId`, `deviceModel`,
  `deviceType`, and `customMetadataId` (from `metadata.d.ts`) are actually
  emitted/consumed by `player-analytics-client-sdk-web`, `-android`, and
  `-swift`, and documented consistently. Reconcile any field the SDKs send that
  the spec does not define, and vice-versa.

- [ ] **F2. Verify server-populated fields against eventsink.** Confirm that
  `domain` (documented as derived from the `Origin` header) and `shardId` are
  populated by `player-analytics-eventsink`/`player-analytics-worker` exactly as
  the spec prose claims, and that clients do not set them.

- [ ] **F3. Verify the `PlayerAnalyticsClientModule` method surface against the
  web SDK.** Confirm that `pause`/`bitrateChanged` (method names) map to the
  `paused`/`bitrate_changed` events in the actual `client-sdk-web`
  implementation, and document the mapping in whichever repo owns it.

- [ ] **F4. Verify the event *sequence* prose against a real SDK.** The event
  flow rules in `specification/README.md` (e.g. "MUST be sent ONCE per session",
  buffering/seeking ordering) should be checked against how at least one SDK
  actually emits events, and any deviation captured.

---

## Suggested issue split

Each top-level item (A1–A5, B1–B3, C1–C3, D1–D3, E1, F1–F4) is written to be
independently implementable and reviewable. Recommended grouping for follow-up
issues:

1. **Schema-accuracy fixes** — A1–A5 (align the metadata/error/warning/stopped
   docs with the TypeScript source). Lowest-risk, highest-value.
2. **Example correctness fixes** — B1–B3 (malformed/incorrect examples).
3. **Naming & versioning consistency** — C1–C3.
4. **Getting-started & contributing** — D1–D3.
5. **Generated-artifact hygiene** — E1.
6. **Cross-repo verification** — F1–F4, one issue per consuming repo.
