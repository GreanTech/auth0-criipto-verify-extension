import * as constants from './constants';
import {toJS} from 'immutable';
import _ from 'lodash'

export const contentType = (simple) => {
    return "application/vnd.grn.easyid." + simple + "+json";
}
export const jsonResp = { responseType: 'json' };
export const getPayload = (response) => { return response.data; }

export const verifyTenantId = (verifyTenant) => {
    return constants.VERIFY_TENANT_ID_PREFIX + verifyTenant.id;
};

export const withTenantId = (templateHref, verifyTenant) => {
    return templateHref.replace(/{tenantId}/, window.btoa(verifyTenantId(verifyTenant)));
}

export const tryToJS = (candidate) => {
    return candidate ? candidate.toJS() : null;
}

const auth0TenantName = () => {
    return _.first(window.config.AUTH0_DOMAIN.split('.'));
};

export const verifyRealm = () => {
    return `urn:auth0:${auth0TenantName()}`;
};

export const verifyApplication = () => {
    var cfg = window.config;
    return {
        name: auth0TenantName(),
        realm: verifyRealm(),
        sessionLifetime: '00:20:00',
        returnUrls: [`https://${cfg.AUTH0_DOMAIN}/login/callback/`],
        authMethods: cfg.CRIIPTO_VERIFY_AUTHMETHODS,
        frameOrigins: [cfg.AUTH0_DOMAIN],
        tags: ['auth0']
    }
};

// Just for suggestions, may be taken already
export const defaultVerifyDnsName = () => {
    var cfg = window.config;
    return `${cfg.AUTH0_DOMAIN.replace(/\./g, '-')}.${cfg.CRIIPTO_VERIFY_TLD}`;
};
