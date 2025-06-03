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
  | "stopped"
  | "bitrate_changed"
  | "error"
  | "warning";

export type TBaseEvent = {
  timestamp: UTCTimestamp;
  playhead: Seconds;
  duration: Seconds;
  sessionId: UUID;
  playerSource: string;
  domain: string;
  path: string;
  contentId: string | number;
  contentTitle: string;
  videoDuration: number;
  videoBitrate: number;
  audioBitrate: number;
  platform: string;
  browser: string;
  deviceClass: string;
  operatingSystem: string;
  deviceType: string;
  userId: string;
  userType: string;
  geoLocation: string;
  duration: number;
  live: boolean;
  metaDataId: string;
  audioLanguage: string;
};
