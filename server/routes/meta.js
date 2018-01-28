import express from 'express';
import baseline from '../../webtask.json';
import ext from '../lib/extension';
import constants from '../constants';
import metaPatch from '../lib/metaPatch';

export default () => {
  const api = express.Router();

  api.get('/', (req, res) => {
    var idServiceProfileKey = ext.name(req);
    var idServiceProfile = constants.ID_SERVICE_PROFILES[idServiceProfileKey];
    var patch = metaPatch(idServiceProfileKey, idServiceProfile);
    var metadata = Object.assign({}, baseline, patch);
    console.log('meta endpoint requested');
    res.status(200).send(metadata);
  });

  return api;
};
