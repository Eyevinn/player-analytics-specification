import { TBaseEvent } from "./base";

export type TBufferedEvent = TBaseEvent & {
  event: "buffered";
}
