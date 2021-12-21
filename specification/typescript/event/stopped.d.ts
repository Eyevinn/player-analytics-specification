import { TBaseEvent } from "./base";

type TStoppedEventPayload = {
  reason: "error" | "ended" | "aborted" | "unknown" | string;
}

export type TStoppedEvent = TBaseEvent & {
  event: "stopped";
  payload: TStoppedEventPayload;
}
