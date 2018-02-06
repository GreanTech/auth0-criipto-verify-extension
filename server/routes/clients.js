import { Router } from 'express';
import _ from 'lodash';

export default () => {
    const api = Router();
    api.get('/', (req, res, next) => {
        req.auth0.clients.getAll()
            .then(connections => {
                return _.filter(connections, c => !c.global);
            })
            .then(connections => res.json(connections))
            .catch(next);
    });

    return api;
};

  