import { TBaseEvent } from "./base";

export type TPlayEvent = TBaseEvent & {
  event: "pas.play";
}