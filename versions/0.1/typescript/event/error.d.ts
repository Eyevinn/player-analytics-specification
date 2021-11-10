import { TBaseEvent } from "./base";

export type TErrorEventPayload = {
  category?: string;
  code: string;
  message?: string;
  // Guard for recursive data structures, or JSON.stringify will crash.
  // Use custom JSON.stringify filter for native errors, since fields are non-enumerable
  data?: Record<string, any>;
}

export type TErrorEvent = TBaseEvent & {
  event: "pas.error";
  payload: TErrorEventPayload;
}
