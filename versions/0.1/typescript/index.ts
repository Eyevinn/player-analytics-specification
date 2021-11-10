import { TInitEvent, TInitResponse } from "./event";
import { THeartbeatEvent } from "./event";
import { TStoppedEvent } from "./event";
import { TLoadingEvent } from "./event";
import { TLoadedEvent } from "./event";
import { TPlayEvent } from "./event";
import { TPlayingEvent } from "./event";
import { TPauseEvent } from "./event";
import { TResumeEvent } from "./event";
import { TBufferingEvent } from "./event";
import { TBufferedEvent } from "./event";
import { TSeekingEvent } from "./event";
import { TSeekedEvent } from "./event";
import { TBitrateChangedEvent } from "./event";
import { TErrorEvent } from "./event";
import { TWarningEvent } from "./event";

export * from "./event";

export interface PlayerAnalyticsClientModule {
  init: (data: TInitEvent) => Promise<TInitResponse>;
  heartbeat: (data: THeartbeatEvent) => void;
  loading: (data: TLoadingEvent) => void;
  loaded: (data: TLoadedEvent) => void;
  play: (data: TPlayEvent) => void;
  playing: (data: TPlayingEvent) => void;
  pause: (data: TPauseEvent) => void;
  resume: (data: TResumeEvent) => void;
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
  TPlayEvent |
  TPlayingEvent |
  TPauseEvent |
  TResumeEvent |
  TBufferingEvent |
  TBufferedEvent |
  TSeekingEvent |
  TSeekedEvent |
  TBitrateChangedEvent |
  TErrorEvent |
  TWarningEvent |
  TStoppedEvent;
