import { TBaseEvent } from "./base";

export type TPlayingEvent = TBaseEvent & {
  event: "playing";
}
