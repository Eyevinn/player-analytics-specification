# Version 0.1

## Supported playback scenarios 

✅ - Fully supported
⚠️ - Partially supported
🚫 - Not supported

| Scenario                 | Support |
|:-------------------------|:--------|
| VOD                      | ✅      |
| Live Events              | ⚠️      |
| Live channels            | ⚠️      |
| Server-side Ad insertion | 🚫      |
| Client-side Ad insertion | 🚫      |

## Terminology

`session` - A session means the viewing session of some particular content so `sessionId` refers to the unique viewing session of content.

## Event flow

Any analytics specification needs a solid and reliable event flow, it is crucial that the following events are implemented correctly for the backend to reliably be able to churn out good session data.

### JSON Schema

```jsonc
{
  event: "event_enum",
  sessionId: "UID" 
  timestamp: 1634911668339, // UTC time. The client SHOULD send valid UTC time.

  playhead: 0, // The current playhead position in milliseconds, if the content is Live should be UTC time. -1 if unknown
  duration: 0, // The duration of the content in milliseconds. VOD = length of stream, Live = live edge in UTC. -1 if unknown 
  payload?: {
    // Unique to each event
    // If needed additional custom fields may be added here as well but the server MAY ignore them. 
  }
}
```

### Flowchart

![](./flowchart/epas_flowchart.png)

### Events

#### init

Sent just before the player starts loading a new contentUrl, a restart of the content SHOULD create a new session.
MUST be sent ONCE per session.
MUST be a unique sessionId.

```jsonc
{
  event: "init",
  sessionId: "", // if not provided the server MUST generate it
  timestamp: -1,
  playhead: -1, // if the player has an expected startTime, eg. if user continues watches a movie, use that value here.
  duration: -1,
  payload: {
    live: false,
    contentId: "",
    contentUrl: "",
    drmType?: "",
    userId?: "", 
    deviceId?: ""
    deviceModel?: ""
    deviceType?: ""
    ... // additional parameters can be added as needed, however the server may choose to ignore them.
  }
}
```

#### heartbeat

MUST be Sent at a fixed interval using the provided value from the `init` event response. The interval SHOULD be agreed upon between client & server.

```jsonc
{
  event: "heartbeat",
  sessionId: "",
  timestamp: 0,
  playhead: 0,
  duration: 0,
  payload?: {
  }
}
```
 
#### loading

Sent when the contentUrl has been attached to the client player.
MUST be sent ONCE per session.

```jsonc
{
  event: "loading",
  timestamp: 0,
  playhead: 0,
  duration: 0,
}
```


#### loaded

This is sent when there is enough buffered content for the player to play the contentUrl.
MUST be sent ONCE per session.

```jsonc
{
  event: "loaded",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### playing

Sent when playback start/resumes, when the playhead starts to move.

```jsonc
{
  event: "playing",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### pause

Sent when the player is paused due to a pause request, not when eg. buffering.

```jsonc
{
  event: "pause",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### buffering

Sent when the player starts buffering. Any buffering that happens when seeking or loading should not be sent as `buffering`.

```jsonc
{
  event: "buffering",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### buffered

Sent when the player resumes playback after buffering. If the buffering is interrupted `buffered` should NOT be sent. 

```jsonc
{
  event: "buffered",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### seeking

This is sent when the player starts seeking to a new playhead time. `playhead` MUST be the current playhead time NOT the target playhead time. MUST not be sent during `loading`.

```jsonc
{
  event: "seeking",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### seeked

Sent when the player starts seeking to a new playhead time. `playhead` MUST be new playhead time.

```jsonc
{
  event: "seeked",
  timestamp: 0,
  playhead: 0,
  duration: 0
}
```

#### bitrate_changed

Sent when the player switches between different ABR levels.

```jsonc
{
  event: "bitrate_changed",
  timestamp: 0,
  playhead: 0,
  duration: 0,
  payload: {
    bitrate: "", // bitrate in Kbps
    width?: "", // video width in pixels
    height?: "", // video height in pixels
    videoBitrate?: "", // if available provide the bitrate for the video track
    audioBitrate?: "", // if available provide the bitrate for the audio track
  }
}
```

#### stopped

Sent when playback stops for whatever reason. 

```jsonc
{
  event: "stopped",
  sessionId: string,
  timestamp: 0,
  playhead: 0,
  duration: 0,
  payload: {
    reason?: "", // eg. "ended", "aborted", "error"
  }
}
```

#### error

Sent when a fatal error occurs the `stopped` event SHOULD be sent with `reason: "error"`.

```jsonc
{
  event: "error",
  timestamp: 0,
  playhead: 0,
  duration: 0,
  payload: {
    category?: "", // eg. NETWORK, DECODER, etc.
    code: "",
    message?: "", 
    data?: {} 
  }
}
```

#### warning

Sent when a non-fatal error occurs, eg. a subtitle track doesn't work but the player is still able to play the content or a playback error that the player can recover
from without interruption.

```jsonc
{
  event: "warning",
  timestamp: 0,
  playhead: 0,
  duration: 0,
  payload: {
    category?: "", // eg. NETWORK, DECODER, osv.
    code "",
    message?: "",
    data?: {} 
  }
}
```
