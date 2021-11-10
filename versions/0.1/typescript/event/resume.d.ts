import { TBaseEvent } from "./base";

export type TResumeEvent = TBaseEvent & {
  event: "pas.resume";
}
