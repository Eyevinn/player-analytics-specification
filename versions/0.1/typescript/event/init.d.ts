import { Seconds, TBaseEvent, UUID } from "./base";

export type TInitEventPayload = Record<string, any> & {
  live: boolean,
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
  sessionId?: UUID;
  heartbeatInterval?: Seconds;
  payload: TInitEventPayload;
}

export type TInitResponse = {
  sessionId: UUID;
  heartbeatInterval: Seconds;
}
