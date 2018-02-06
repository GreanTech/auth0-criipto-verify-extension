import { Router } from 'express';
import _ from 'lodash';
import moment from 'moment';
import { middlewares } from 'auth0-extension-express-tools';
import tools from 'auth0-extension-tools';

import config from '../lib/config';

import connections from './connections';
import clients from './clients';

export default (storage) => {
  const managementApiClient = middlewares.managementApiClient({
    domain: config('AUTH0_ISSUER_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  });

  const api = Router();

  const getToken = req => _.get(req, 'headers.authorization', '').split(' ')[1];

  // Allow only dashboard admins.
  api.use(middlewares.authenticateAdmins({
    credentialsRequired: false,
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:criipto-verify',
    baseUrl: config('PUBLIC_WT_URL')
  }));

  /* Fight caching attempts by IE */
  api.use((req, res, next) => {
    res.setHeader('Cache-control', 'no-cache, no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  api.use('/connections', managementApiClient, connections(storage));
  api.use('/clients', managementApiClient, clients());

  return api;
}
;
