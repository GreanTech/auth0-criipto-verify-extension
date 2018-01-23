# Auth0 Criipto Verify Administration Extension

## Running in Production

```bash
npm install
npm run client:build
npm run server:prod
```

## Running in Development

To run the extension:

```bash
npm install
npm run serve:dev
```

### Configuration

Update the configuration file under `./server/config.json`:

```json
{
  "AUTHORIZE_API_KEY": "mysecret",
  "EXTENSION_SECRET": "mysecret",
  "WT_URL": "http://localhost:3000/",
  "AUTH0_DOMAIN": "me.auth0.com",
  "AUTH0_CLIENT_ID": "myclientid",
  "AUTH0_CLIENT_SECRET": "myclientsecret",
  "EXTENSION_CLIENT_ID": "myotherclientid"
}
```

As you can see, there are 2 clients involved here.

**Management API Client**

First you'll need to create a "Non Interactive Client" and add the details in `AUTH0_DOMAIN` / `AUTH0_CLIENT_ID` and `AUTH0_CLIENT_SECRET`. Then go to [APIs](https://manage.auth0.com/#/apis) and add the "Non Interactive Client" there with the following scopes:

```
read:connections write:connections
```

This client will be used to interact with the Management API (eg: load connections, ....).

> Note: When installing this as a real extension it will be done automatically.

## Usage

See the [official documentation page on github.com](https://github.com/GreanTech/auth0-criipto-verify-extension).


## Runtime context dump from gallery (the parts that make up the config system): 
```
process.env { WARN_DB_SIZE: 409600,
  MAX_MULTISELECT_USERS: 5,
  MULTISELECT_DEBOUNCE_MS: 250,
  PER_PAGE: 10,
  NODE_ENV: 'production',
  CLIENT_VERSION: '1.0.0' }

webtaskContext.params { '72122ce96bfec66e2396d2e25225d70a': 'easyid-demo',
  '2af72f100c356273d46284f6fd1dfc08': '1.0.0' }

webtaskContext.secrets { EXTENSION_SECRET: '...REDACTED...',
  AUTH0_CLIENT_ID: 'EOnu3XIm67lhvavR2Mocn8k8Qj6Ze4CK',
  AUTH0_CLIENT_SECRET: '...REDACTED...',
  AUTH0_SCOPES: 'read:connections create:connections',
  AUTH0_DOMAIN: 'easyid-demo.eu.auth0.com',
  AUTH0_RTA: 'https://auth0.auth0.com',
  AUTH0_MANAGE_URL: 'https://manage.auth0.com',
  WT_URL: 'https://easyid-demo.eu.webtask.io/auth0-criipto-verify-admin',
  ISOLATED_DOMAIN: 'true' }
```