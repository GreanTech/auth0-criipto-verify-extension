import _ from 'lodash';
import { Router } from 'express';

export default (scriptManager) => {
  const api = Router();
  api.get('/', (req, res, next) => {
    req.auth0.connections.getAll()
      .then(connections => {
        const settingsContext = {
          request: {
            user: req.user
          }
        };

        return scriptManager.execute('settings', settingsContext)
          .then(settings => {
            let result = _.chain(connections)
              .filter((conn) => conn.strategy === 'adfs')
              .sortBy((conn) => conn.name.toLowerCase())
              .value();

            if (settings && settings.connections && Array.isArray(settings.connections) && settings.connections.length) {
              result = result.filter(conn => (settings.connections.indexOf(conn.name) >= 0));
            }

            return result;
          });
      })
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
