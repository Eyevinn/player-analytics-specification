type UTCTimestamp = number;
type UUID = string;
type Seconds = number;

export type TBatchedEventType =
  | "loading"
  | "loaded"
  | "play"
  | "playing"
  | "pause"
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
}
