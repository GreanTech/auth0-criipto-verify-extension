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
    req.auth0.connections.getAll()
      .then(connections => {
        var nameClashCandidate = 
          connections.find(c => c.name === payload.name && c.strategy === 'adfs');
        var requestedAdfsServer = payload.options.adfs_server;
        console.info(nameClashCandidate);
        if (nameClashCandidate
          && nameClashCandidate.options.adfs_server !== requestedAdfsServer) {
            var msg = 
              `An ADFS connection with name ${payload.name} already exists`
              + `, but points to another server (${nameClashCandidate.options.adfs_server})`
              + ` than the specified one (${requestedAdfsServer})`
              + `. If the current value is incorrect, you can change it from Auth0's management UI (Connections -> Enterprise -> ADFS -> 'Settings' cog for ${payload.name})`;
            throw Error(msg);
        }
      })
      .then(() => {
        return req.auth0.connections.create(payload)
          .then(() => res.status(204).send())
      })
      .catch(next);
  });

  return api;
};
