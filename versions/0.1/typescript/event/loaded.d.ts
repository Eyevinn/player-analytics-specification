import { TBaseEvent } from "./base";

export type TLoadedEvent = TBaseEvent & {
  event: "pas.loaded";
}
