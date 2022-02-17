import { TBaseEvent } from "./base";

export type TMetadataEventPayload = Record<string, any> & {
  live?: boolean;
  contentTitle?: string;
}

export type TMetadataEvent = TBaseEvent & {
  event: "metadata";
  payload: TMetadataEventPayload;
}
