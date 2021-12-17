import { TBaseEvent } from "./base";

type TStoppedEventPayload = {
  reason?: string;
}

export type TStoppedEvent = TBaseEvent & {
  event: "stopped";
  payload: TStoppedEventPayload;
}
