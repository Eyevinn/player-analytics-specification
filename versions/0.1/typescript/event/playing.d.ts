import { TBaseEvent } from "./base";

export type TPlayingEvent = TBaseEvent & {
  event: "pas.playing";
}
