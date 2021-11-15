import { TBaseEvent } from "./base";

export type TSeekingEvent = TBaseEvent & {
  event: "seeking";
}
