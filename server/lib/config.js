const config = require('auth0-extension-tools').config();
const logger = require('./logger');

const defaultValues = {
  "CRIIPTO_VERIFY_CLIENT_ID": "aMnRpmOmyfTFzTuN1iWUmAIFgE0r16Hd",
  "CRIIPTO_VERIFY_AUTH0_DOMAIN": "grean.auth0.com",
  "CRIIPTO_VERIFY_DOMAIN": "api.grean.id"
}

const daeConfig = function(key) {
  if (key === 'AUTH0_ISSUER_DOMAIN') {
    return config('AUTH0_ISSUER_DOMAIN') || config('AUTH0_DOMAIN');
  }
  
  var val = config(key);
  if (!val) {
    val = defaultValues[key];
    logger.info("Lookup in default values (key -> val)", key, val);
  }
  return val;  
};

daeConfig.getValue = function(key) {
  return config(key);
}

daeConfig.setValue = function(key, value) {
  return config.setValue(key, value);
}

daeConfig.setProvider = function(provider) {
  return config.setProvider(provider);
}

module.exports = daeConfig;
