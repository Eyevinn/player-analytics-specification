import type {
  TInitEvent,
  THeartbeatEvent,
  TStoppedEvent,
  TLoadingEvent,
  TLoadedEvent,
  TPlayingEvent,
  TPausedEvent,
  TBufferingEvent,
  TBufferedEvent,
  TSeekingEvent,
  TSeekedEvent,
  TBitrateChangedEvent,
  TErrorEvent,
  TWarningEvent,
  TMetadataEvent
} from "./event";

export * from "./event";

export interface PlayerAnalyticsClientModule {
  init: (data: TInitEvent) => void;
  metadata: (data: TMetadataEvent) => void;
  heartbeat: (data: THeartbeatEvent) => void;
  loading: (data: TLoadingEvent) => void;
  loaded: (data: TLoadedEvent) => void;
  playing: (data: TPlayingEvent) => void;
  pause: (data: TPausedEvent) => void;
  buffering: (data: TBufferingEvent) => void;
  buffered: (data: TBufferedEvent) => void;
  seeking: (data: TSeekingEvent) => void;
  seeked: (data: TSeekedEvent) => void;
  bitrateChanged: (data: TBitrateChangedEvent) => void;
  error: (data: TErrorEvent) => void;
  warning: (data: TWarningEvent) => void;
  stopped: (data: TStoppedEvent) => void;
}

export type TPlayerAnalyticsEvent = TInitEvent |
  THeartbeatEvent |
  TLoadingEvent |
  TLoadedEvent |
  TPlayingEvent |
  TPausedEvent |
  TBufferingEvent |
  TBufferedEvent |
  TSeekingEvent |
  TSeekedEvent |
  TBitrateChangedEvent |
  TErrorEvent |
  TWarningEvent |
  TStoppedEvent |
  TMetadataEvent;
