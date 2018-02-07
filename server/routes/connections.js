import _ from 'lodash';
import { Router } from 'express';
import url from 'url';

export default (storage) => {
  const api = Router();
  api.post('/search', (req, res, next) => {
    var registeredTenants = req.body.registeredTenants;
    var allDomains = 
      _.flatten(_.map(registeredTenants, registeredTenant => 
        _.flatten(_.map(registeredTenant.domains, domain => domain.name))
      ));
    req.auth0.connections.getAll()
      .then(connections => {
        var filtered = 
          connections
            .filter(c => c.strategy === 'adfs' && c.options && c.options.adfs_server)
            .filter(c => {
              var server = url.parse(c.options.adfs_server);
              return _.indexOf(allDomains, server.hostname) > -1;
            });
        return filtered;
      })
      .then(connections => res.json(connections))
      .catch(next);
  });

  api.patch('/:id', (req, res, next) => {
    req.auth0.connections.update(
        { id: req.params.id }, 
        { enabled_clients : req.body.enabled_clients }
      ).then(() => res.status(204).send())
      .catch(next);
  });

  api.post('/', (req, res, next) => {
    var payload = _.assign({}, req.body, {strategy: 'adfs'});
    req.auth0.connections.create(payload)
      .then(() => res.status(204).send())
      .catch(next);
  });

  return api;
};
