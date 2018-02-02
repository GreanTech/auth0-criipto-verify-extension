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

export const verifyDnsName = () => {
    var cfg = window.config;
    return `${cfg.AUTH0_DOMAIN.replace(/\./g, '-')}.${cfg.CRIIPTO_VERIFY_TLD}`;
};

export const tryToJS = (candidate) => {
    return candidate ? candidate.toJS() : null;
}

export const verifyRealm = () => {
    var auth0TenantName = _.first(window.config.AUTH0_DOMAIN.split('.'));
    return `urn:auth0:${auth0TenantName}`;
}