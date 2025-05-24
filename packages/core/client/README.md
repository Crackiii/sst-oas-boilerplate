#API Client

Uses [`openapi-client-axios`](https://github.com/anttiviljami/openapi-client-axios)

## Getting Started

Install the package:

```bash
npm install --save-dev @sst-openapi-boilerplate/api-client
```

Import the package:

```typescript
import { getClient } from '@sst-openapi-boilerplate/api-client';
```

Use the client:
```typescript
// get typed client
const client = await getClient();

// call an operation
const res = await client.getPets();
```

## BaseURL & Authorization

To pass an authorization header and set up the API url, you can use axios
defaults:

```typescript
const client = getClient();
client.defaults.baseURL = config.API_URL;
client.defaults.headers['authorization'] = `Bearer ${token}`;
```
