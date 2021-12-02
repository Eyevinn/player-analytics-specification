import { TBaseEvent } from "./base";
import { TInitEvent } from "./init";
import { THeartbeatEvent } from "./heartbeat";
import { TLoadingEvent } from "./loading";
import { TLoadedEvent } from "./loaded";
import { TPlayEvent } from "./play";
import { TPlayingEvent } from "./playing";
import { TPauseEvent } from "./pause";
import { TResumeEvent } from "./resume";
import { TBufferingEvent } from "./buffering";
import { TBufferedEvent } from "./buffered";
import { TSeekingEvent } from "./seeking";
import { TSeekedEvent } from "./seeked";
import { TBitrateChangedEvent } from "./bitrate-changed";
import { TErrorEvent } from "./error";
import { TWarningEvent } from "./warning";
import { TStoppedEvent } from "./stopped";

export type TBatchEventPayload = {
  event: Array<
    TInitEvent |
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
    TStoppedEvent
    >;
}

export type TBatchEvent = TBaseEvent & {
  payload: TBatchEventPayload;
}
