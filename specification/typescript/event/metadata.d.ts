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
  /**
   * OPTIONAL. A client-defined grouping key for related metadata events.
   *
   * Opaque to the server: the client assigns it however it likes and the
   * server MUST NOT interpret or validate its value. Being optional, it is
   * fully back-compatible — omitting it leaves existing behaviour unchanged.
   */
  customMetadataId?: number;
  [key: string]: string | number | boolean; // Allow additional metadata properties
}

export type TMetadataEvent = TBaseEvent & {
  event: "metadata";
  payload: TMetadataEventPayload;
}
