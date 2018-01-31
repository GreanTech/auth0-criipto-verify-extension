import * as constants from './constants';

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