import _ from 'lodash';
import { Router } from 'express';

export default (scriptManager, storage) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    req.auth0.connections.getAll()
      .then(connections => {
        storage.read().then(storedData => { 
          var data = storedData || {};             
          var connectionIds = data.connections || [];
          var filtered = connections.filter(c => c.strategy === 'adfs' && connectionIds.indexOf(c.id) >= 0);
          return filtered;
        })
      })
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
