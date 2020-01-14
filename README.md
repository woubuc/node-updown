# node-updown
[![npm](https://img.shields.io/npm/v/node-updown)](https://www.npmjs.com/package/node-updown)
[![David](https://img.shields.io/david/woubuc/node-updown)](https://david-dm.org/woubuc/node-updown)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![MIT license](https://img.shields.io/github/license/woubuc/node-updown)](https://github.com/woubuc/node-updown/blob/master/LICENSE)

Transparent Node.js wrapper for the [updown.io](http://updown.io) API

Uses `cross-fetch` so should work in browsers and in node.

```
yarn add node-updown
```

# Usage
There are two ways to use the library:

## Client
```typescript
import { UpdownClient } from 'node-updown';

// Create the client with your API key (readonly or full access)
const client = new UpdownClient('API_KEY');

// Use one of the methods to interact with the API
let check = await client.getCheck('TOKEN');
```

This is the recommended way to use if you need to make lots of API calls, or if you have a long-running application (e.g. a server).

## Functional
```typescript
import { getCheck } from 'node-updown';

// Use the API function directly, by adding your API key
let check = await getCheck('API_KEY', 'TOKEN');
```

This is useful if you only need to make one or two API calls, or if you want to limit the size of your bundle by tree-shaking the unused functions.

# API
In this documentation, we'll use the client instance. To use the functional API, simply add your API key as the first argument. So `client.getCheck(token)` becomes `getCheck(apiKey, token)`.

The API is kept as transparent as possible, so all values and options should mirror the [Updown API documentation](https://updown.io/api) closely. Consult the API docs to see the returned data for each call.

Tokens are always required, most other settings are optional unless listed otherwise. All functions operating on an entity will take the entity ID/token as a first parameter (or second, if you're using the functional API) and an options object containing the remaining parameters.

The library is entirely promise-based.

Time strings should be in one of the [supported formats](https://updown.io/api#times).


#### Get checks
```typescript
client.getChecks();
```

#### Get check
```typescript
client.getCheck(token);
```

#### Get downtimes
```typescript
client.getDowntimes(token, { page });
```
- `page` (number): the page to fetch, default 1

#### Get metrics
```typescript
client.getMetrics(token, { from, to, group });
```
- `from` (time): start time, default 1 month ago
- `to` (time): end time, default now
- `group` (string): group data by hour (`'time'`) or by monitoring location (`'host'`)

#### Add check
```typescript
client.addCheck(params);
```
See the [API docs](https://updown.io/api) for the full list of parameters

#### Update check
```typescript
client.updateCheck(token, params);
```
See the [API docs](https://updown.io/api) for the full list of parameters

#### Delete check
```typescript
client.deleteCheck(token);
```

#### Get monitoring nodes
```typescript
client.getNodes();
```
_Note: this function does not require an API key_

#### Get IP addresses of monitoring nodes
```typescript
client.getIpv4Nodes();
client.getIpv6Nodes();
```
_Note: these functions do not require an API key_

#### Get webhooks
```typescript
client.getWebhooks();
```

#### Add webhook
```typescript
client.addWebhook({ url });
```
- `url` (string): the URL of the webhook

#### Delete webhook
```typescript
client.deleteWebhook(id);
```
- `id` (string): ID of the webhook you want to delete

## Issues
If you experience any bugs or errors, or if you have any questions about how to use this library, be sure to create an issue.

## LICENSE
This package is licensed under the [MIT license](https://github.com/woubuc/node-updown/blob/master/LICENSE.txt).
