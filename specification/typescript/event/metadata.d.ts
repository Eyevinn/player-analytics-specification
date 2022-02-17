import { TBaseEvent } from "./base";

export type TMetadataEventPayload = Record<string, any> & {
  live?: boolean;
  contentTitle?: string;
  contentId?: string;
  contentUrl?: string;
  drmType?: string;
  userId?: string;
  deviceId?: string;
  deviceModel?: string;
  deviceType?: string;
}

export type TMetadataEvent = TBaseEvent & {
  event: "metadata";
  payload: TMetadataEventPayload;
}
