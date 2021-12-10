type UTCTimestamp = number;
type UUID = string;
type Seconds = number;

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
  | "bitrate_changed"
  | "error"
  | "warning";

export type TBaseEvent = {
  timestamp: UTCTimestamp;
  playhead: Seconds;
  duration: Seconds;
  sessionId: UUID;
}
