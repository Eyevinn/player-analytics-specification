# Open Analytics Specification

[Eyevinn Open Analytics](https://docs.osaas.io/osaas.wiki/Solution%3A-Eyevinn-Open-Analytics.html) is an open specification that defines a standard for implementing analytics in any media player. By implementing the specification, a player can send analytics data to an Open Analytics compatible backend. See [demo](https://analytics.demo.osaas.io/). Reference integrations are available for:

**Client**

[Open Analytics Web Player SDK](https://github.com/Eyevinn/player-analytics-client-sdk-web)
[Open Analytics Android Player SDK](https://github.com/Eyevinn/player-analytics-client-sdk-android)
[Open Analytics iOS Player SDK](https://github.com/Eyevinn/player-analytics-client-sdk-swift)

**Server**

[Open Analytics Event Sink](https://github.com/Eyevinn/player-analytics-eventsink)
[Open Analytics Worker](https://github.com/Eyevinn/player-analytics-worker)

## Specification

See the [Specification README](specification/README.md).

The specification consists of typescript definitions, a generated JSON schema, documentation, and an event flow.

The specification is strictly for tracking playback quality using a concise set of events, that must follow a predictable sequence.

The specification makes no assumptions about metadata surrounding quality tracking, like device type, user agent, or operating system version. Metadata is considered implementation specific. The specification is designed to allow for custom metadata to be added to a session at any time, see [Metadata Event](specification/README.md#metadata).

## Using in a Project

The specification can be added as a direct dependency to a Node/Deno based project, or it can be downloaded as an artifact from the github releases page.

The event specification can be consumed directly as a set of TypeScript types or JSON schema, or as a reference documentation for an integration.

See [Releases](https://github.com/Eyevinn/player-analytics-specification/releases), or use `npm i @eyevinn/player-analytics-specification`.

## Contributing

We welcome contributions, and recommend creating a Github Issue to discuss changes before starting work. This helps ensure that the changes align with the goals of the specification, and that we can provide guidance on implementation.

The specification is written in TypeScript, and requires a Node.js environment with Yarn to build and test. To transform the specification into a JSON schema, use the `npm run json` command.

Contributions should:

- Update the TypeScript definitions in `/specification`
- Update the README in `/specification`
- Run `npm run json` to generate an updated JSON schema
- Run `npm run typedoc` to generate updated documentation
- OPTIONAL: Update the flowchart in `/specification/flowchart.md`

## About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in the sense that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This gives us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
