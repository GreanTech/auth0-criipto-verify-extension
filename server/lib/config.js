const config = require('auth0-extension-tools').config();
const logger = require('./logger');

const defaultValues = {
  "CRIIPTO_VERIFY_CLIENT_ID": "aMnRpmOmyfTFzTuN1iWUmAIFgE0r16Hd",
  "CRIIPTO_VERIFY_AUTH0_DOMAIN": "grean.us.webtask.io/authorize-request-router",
  "CRIIPTO_VERIFY_AUTH0_TOKEN_ISSUER": "https://grean.auth0.com/",
  "CRIIPTO_VERIFY_DOMAIN": "api.grean.id",
  "CRIIPTO_VERIFY_TLD": "criipto.id",
  "VERIFY_GAUSS_APP_ID": "urn:grn:entityid:application:easyid",
  "GAUSS_DOMAIN": "grean-api.greantech.com",
  // "AUTH0_TOKEN_ISSUER": "https://grean.auth0.com/",
  // "AUTH0_ISSUER_DOMAIN": "grean.auth0.com",
  "AUTH0_RTA": "auth0.auth0.com"  
}

const daeConfig = function(key) {
  var val = config(key); 
  if (key === 'AUTH0_ISSUER_DOMAIN' && !val) {
    val = config('AUTH0_DOMAIN');
  }
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
