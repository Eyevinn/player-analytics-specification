type UTCTimestamp = number;
type UUID = string;
type Milliseconds = number;
type ShardId = string;
type Domain = string;

export type TEventType =
  | "init"
  | "metadata"
  | "heartbeat"
  | "loading"
  | "loaded"
  | "playing"
  | "paused"
  | "buffering"
  | "buffered"
  | "seeking"
  | "seeked"
  | "stopped"
  | "bitrate_changed"
  | "error"
  | "warning";

export type TBaseEvent = {
  timestamp: UTCTimestamp;
  /**
   * The current playhead position as an integer number of milliseconds. If the
   * content is Live this SHOULD be the UTC time in milliseconds. `-1` if unknown.
   */
  playhead: Milliseconds;
  /**
   * The duration of the content as an integer number of milliseconds. VOD =
   * length of stream; Live = live edge in UTC (milliseconds). `-1` if unknown.
   */
  duration: Milliseconds;
  sessionId: UUID;
  shardId?: ShardId;
  /**
   * OPTIONAL. Populated by the ingest server, NOT by the client.
   *
   * The server SHOULD derive this from the request's HTTP `Origin` header
   * (the scheme + host + optional port of the page that produced the event,
   * e.g. "https://example.com"). It MUST NOT be trusted as a client-supplied
   * value. When the `Origin` header is absent, the field is omitted entirely
   * (it is never set to an empty string or a placeholder).
   */
  domain?: Domain;
}
