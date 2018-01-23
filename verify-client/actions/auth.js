import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { push } from 'react-router-redux';
import uuid from 'uuid';

import * as constants from '../constants';

const issuer = window.config.CRIIPTO_VERIFY_AUTH0_TOKEN_ISSUER || `https://${window.config.CRIIPTO_VERIFY_AUTH0_DOMAIN}/`;

const webAuth = new auth0.WebAuth({ // eslint-disable-line no-undef
  domain: window.config.CRIIPTO_VERIFY_AUTH0_DOMAIN,
  clientID: window.config.CRIIPTO_VERIFY_CLIENT_ID,
  overrides: {
    __tenant: issuer.substr(8).split('.')[0],
    __token_issuer: issuer
  }
});

export function login(returnUrl) {
  sessionStorage.setItem('criipto-verify-extension:returnTo', returnUrl);

  webAuth.authorize({
    responseType: 'id_token',
    redirectUri: `${window.config.BASE_URL}/login`,
    scope: 'openid email name'
  });

  return {
    type: constants.SHOW_LOGIN
  };
}

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function logout() {
  return (dispatch) => {
    sessionStorage.removeItem('criipto-verify:apiToken');

    if (window.config.FEDERATED_LOGOUT) {
      window.location.href = `https://${window.config.CRIIPTO_VERIFY_AUTH0_DOMAIN}/v2/logout?federated&client_id=${window.config.CRIIPTO_VERIFY_CLIENT_ID}&returnTo=${encodeURIComponent(window.config.BASE_URL)}`;
    } else {
      window.location.href = `https://${window.config.CRIIPTO_VERIFY_AUTH0_DOMAIN}/v2/logout?client_id=${window.config.CRIIPTO_VERIFY_CLIENT_ID}&returnTo=${encodeURIComponent(window.config.BASE_URL)}`;
    }

    dispatch({
      type: constants.LOGOUT_PENDING
    });
  };
}

const processTokens = (dispatch, apiToken, returnTo) => {
  const decodedToken = jwtDecode(apiToken);
  if (isExpired(decodedToken)) {
    return;
  }

  axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

  sessionStorage.setItem('criipto-verify:apiToken', apiToken);

  dispatch({
    type: constants.LOADED_TOKEN,
    payload: {
      token: apiToken
    }
  });

  dispatch({
    type: constants.LOGIN_SUCCESS,
    payload: {
      token: apiToken,
      decodedToken,
      user: decodedToken,
      returnTo
    }
  });

  if (returnTo) {
    dispatch(push(returnTo));
  }
};

export function loadCredentials() {
  return (dispatch) => {
    const token = sessionStorage.getItem('criipto-verify:apiToken');
    if (token || window.location.hash) {

      if (window.location.hash) {
        dispatch({
          type: constants.LOGIN_PENDING
        });

        return webAuth.parseHash({
          hash: window.location.hash
        }, (err, hash) => {
          if (err || !hash || !hash.idToken) {
            /* Must have had hash, but didn't get an idToken in the hash */
            console.error('login error: ', err);;
            return dispatch({
              type: constants.LOGIN_FAILED,
              payload: {
                error: err && err.error ? `${err.error}: ${err.errorDescription}` : 'UnknownError: Unknown Error'
              }
            });
          }

          const returnTo = sessionStorage.getItem('criipto-verify-extension:returnTo');
          sessionStorage.removeItem('criipto-verify-extension:returnTo');
          return processTokens(dispatch, hash.idToken, returnTo);
        });
      }

      /* There was no hash, so use the token from storage */
      return processTokens(dispatch, token);
    }
  };
}