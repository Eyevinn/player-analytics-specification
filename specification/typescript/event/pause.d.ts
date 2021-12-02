import { TBaseEvent } from "./base";

export type TPauseEvent = TBaseEvent & {
  event: "pause";
}
