import { TBaseEvent } from "./base";

export type TInitEventPayload = Record<string, any> & {
  contentId: string;
  contentUrl: string;
  drmType?: string;
  userId?: string;
  deviceId?: string;
  deviceModel?: string;
  deviceType?: string;
}

export type TInitEvent = TBaseEvent & {
  event: "init";
  payload: TInitEventPayload;
}
