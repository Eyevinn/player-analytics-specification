type UTCTimestamp = number;
type UUID = string;
type Seconds = number;

export type TBatchedEventType =
  | "pas.loading"
  | "pas.loaded"
  | "pas.play"
  | "pas.playing"
  | "pas.pause"
  | "pas.resume"
  | "pas.buffering"
  | "pas.buffered"
  | "pas.seeking"
  | "pas.seeked"
  | "pas.bitrate_changed"
  | "pas.error"
  | "pas.warning";

export type TBaseEvent = {
  timestamp: UTCTimestamp;
  playhead: number;
  duration: number;
}
