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
