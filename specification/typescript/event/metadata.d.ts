import { TBaseEvent } from "./base";

export type TMetadataEventPayload = {
  live?: boolean;
  contentTitle?: string;
  contentId?: string;
  contentUrl?: string;
  drmType?: string;
  userId?: string;
  deviceId?: string;
  deviceModel?: string;
  deviceType?: string;
  /**
   * OPTIONAL. A client-defined grouping key for related metadata events.
   *
   * Opaque to the server: the client assigns it however it likes and the
   * server MUST NOT interpret or validate its value. Being optional, it is
   * fully back-compatible — omitting it leaves existing behaviour unchanged.
   */
  customMetadataId?: number;
  [key: string]: string | number | boolean; // Allow additional metadata properties
}

export type TMetadataEvent = TBaseEvent & {
  event: "metadata";
  payload: TMetadataEventPayload;
  /**
   * OPTIONAL. Populated by the ingest server, NOT by the client.
   *
   * ISO 3166-1 alpha-2 country code (e.g. "SE") that the server MAY derive
   * from the request — typically via a geo lookup of the caller's address.
   * It is server-derived and MUST NOT be trusted as a client-supplied value;
   * the SDKs do not send it. When the server cannot determine the country,
   * the field is omitted entirely (it is never set to an empty string or a
   * placeholder). Being optional, it is fully back-compatible — omitting it
   * leaves existing payloads valid.
   */
  country?: string;
  /**
   * OPTIONAL. Populated by the ingest server, NOT by the client.
   *
   * City name that the server MAY derive from the request — typically via a
   * geo lookup of the caller's address. It is server-derived and MUST NOT be
   * trusted as a client-supplied value; the SDKs do not send it. When the
   * server cannot determine the city, the field is omitted entirely (it is
   * never set to an empty string or a placeholder). Being optional, it is
   * fully back-compatible — omitting it leaves existing payloads valid.
   */
  city?: string;
}
