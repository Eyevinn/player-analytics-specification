import { TBatchEvent, TBatchEventPayload } from "./batch";
import { UUID } from "./base";

export type TStoppedEvent = TBatchEvent & {
  event: "pas.batch.stopped";
  sessionId: UUID;
  payload: TBatchEventPayload;
}
