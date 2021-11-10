import { TBaseEvent } from "./base";

export type TBufferingEvent = TBaseEvent & {
  event: "pas.buffering";
}
