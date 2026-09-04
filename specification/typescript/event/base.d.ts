type UTCTimestamp = number;
type UUID = string;
type Seconds = number;
type ShardId = string;
type Domain = string;

export type TEventType =
  | "init"
  | "heartbeat"
  | "loading"
  | "loaded"
  | "playing"
  | "paused"
  | "resume"
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
  playhead: Seconds;
  duration: Seconds;
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
