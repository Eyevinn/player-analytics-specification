import { TBaseEvent } from "./base";

export type TBitrateChangedEventPayload = {
  bitrate: number;
  width?: number;
  height?: number;
  videoBitrate?: number;
  audioBitrate?: number;
}

export type TBitrateChangedEvent = TBaseEvent & {
  event: "pas.bitrate_changed";
  payload: TBitrateChangedEventPayload;
}
