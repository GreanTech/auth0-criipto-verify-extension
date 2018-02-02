import { Router as router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';

import config from '../lib/config';
import logger from '../lib/logger';
import uuid from 'uuid';

export default (storage) => {
  const hookValidator = middlewares
    .validateHookToken(config('AUTH0_ISSUER_DOMAIN'), config('WT_URL'), config('EXTENSION_SECRET'));

  const hooks = router();
  hooks.use('/on-install', hookValidator('/.extensions/on-install'));

  hooks.post('/on-install', (req, res) => {
    logger.info("Install hook running. ", (req.webtaskContext ? req.webtaskContext : req));
    storage.read().then(storedData => { 
        var data = storedData || {};             
        var gaussEntityId = data.gaussEntityId;
        if (gaussEntityId) {
            logger.info('Found existing Gauss entityIdentifier', gaussEntityId);
            return storedData;
        }
        else 
        {
            var id = uuid.v4();
            data.gaussEntityId = 'urn:grn:entityid:organization:verify:auth0:' + id;
            logger.info('Generated new Gauss entityIdentifier', data.gaussEntityId);
            return storage.write(data); 
        }
    })
});

  return hooks;
};