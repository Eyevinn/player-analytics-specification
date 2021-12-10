import { TBaseEvent } from "./base";

export type THeartbeatEvent = TBaseEvent & {
  event: "heartbeat";
}
