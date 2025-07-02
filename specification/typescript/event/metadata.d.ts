import { TBaseEvent } from "./base";

export type TMetadataEventPayload = {
  live?: boolean;
  contentTitle?: string;
  contentId?: string;
  contentUrl?: string;
  drmType?: string;
  userId?: string;
  deviceId?: string;
  deviceModel?: string;
  deviceType?: string;
  [key: string]: string | boolean; // Allow additional metadata properties
}

export type TMetadataEvent = TBaseEvent & {
  event: "metadata";
  payload: TMetadataEventPayload;
}
