import { TBaseEvent } from "./base";

export type TPausedEvent = TBaseEvent & {
  event: "paused";
}
