import { TBatchEvent, TBatchEventPayload } from "./batch";
import { UUID } from "./base";

export type THeartbeatEvent = TBatchEvent & {
  event: "pas.batch.heartbeat";
  sessionId?: UUID;
  payload: TBatchEventPayload;
}
