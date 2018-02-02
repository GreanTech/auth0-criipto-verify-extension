import axios from "axios";
import * as constants from '../constants';
import _ from 'lodash'; 
import renewAuth from './auth';
import { toJS } from 'immutable';
import {contentType, jsonResp, getPayload, verifyTenantId, withTenantId, verifyRealm, verifyApplication, defaultVerifyDnsName} from '../dsl'

const getScopedClaims = (scopedClaimsLink) => {
    // User may already have onboarded before
    var scopedClaimsRef = scopedClaimsLink.href.replace(
        '{application}', 
        window.btoa(window.config.VERIFY_GAUSS_APP_ID));
    return axios.get(scopedClaimsRef)
        .then(getPayload)
        .then((scopedClaims) => { 
            return scopedClaims.claimScopes; 
        });
}

function fetchVerifyTenants() {
    return (dispatch) => { 
        dispatch({
            type: constants.FETCH_VERIFY_TENANTS,
            payload: {
                promise:
                    axios.get(window.config.GAUSS_API_ROOT, jsonResp)
                        .then(getPayload)
                        .then((gaussRoot) => {
                            var scopedClaimsLink = _.find(
                                gaussRoot.linkTemplates, 
                                { 'rel': 'gauss:scoped-user-claims' });
                            if (scopedClaimsLink)
                            {
                                return getScopedClaims(scopedClaimsLink);
                            } 
                            else
                            {
                                // Unknown user
                                return [];
                            }
                        })
            }
        })
    }
};

function fetchVerifyLinks() {
    return { 
        type: constants.FETCH_VERIFY_LINKS,
        payload: {
            promise: 
                axios.get(window.config.VERIFY_API_ROOT)
                .then(getPayload)
        }
    }
  };
  
export function fetchCore() {
    return (dispatch) => { 
        dispatch( {
            type: "FETCH_CORE",
            payload : {
                promise: Promise.all([
                    dispatch(fetchVerifyTenants()),
                    dispatch(fetchVerifyLinks())
                ]).then(() => {
                    dispatch(checkDomainAvailable(defaultVerifyDnsName()))
                })
            }
        })
    }
}

export function checkDomainAvailable(dnsName) {
    return (dispatch, getState) => {
        var linkTemplates = getState().verifyLinks.get('linkTemplates').toJS();
        var dnsAvailableLink = _.find(linkTemplates, {'rel' : 'easyid:dns-available'});
        var dnsAvailableResource = dnsAvailableLink.href.replace(/{domain}/, dnsName);
        dispatch({
            type: constants.CHECK_VERIFY_DOMAIN_AVAILABLE,
            payload: {
                promise: 
                    axios.get(dnsAvailableResource)
                        .then(getPayload)
                        .then(r => {
                            return { available: r.available, nameCandidate: dnsName };
                        })
            }
        });
    }
};

export function createVerifyTenant(user, verifyLinks, verifyLinkTemplates) {
    var accessRequestLink = _.find(verifyLinks, { 'rel': 'easyid:access-request'});
    var payload = {
        entityIdentifier : constants.GAUSS_ENTITY_ID,
        name: window.config.AUTH0_DOMAIN,
        contactEmail: user.get('email'),
        contactName: user.get('name')
    };
    return (dispatch) => {
        dispatch({
            type: constants.CREATE_VERIFY_TENANT,
            payload: {
                promise:
                    Promise.all([
                        axios.post(
                            accessRequestLink.href, 
                            payload, 
                            {
                                headers: {
                                    'Content-Type' : contentType('access-request')
                                }
                            }),
                            dispatch(renewAuth()),
                            dispatch(fetchVerifyTenants())
                        ])
            }
        })
    }
};

function tenantDomainsResource(verifyTenant, verifyLinkTemplates) {
    var verifyDomainsResourceTemplate = 
        _.find(verifyLinkTemplates, {'rel' : 'easyid:tenant-domains'});
    var verifyDomainsResource = 
        withTenantId(verifyDomainsResourceTemplate.href, verifyTenant);
    return verifyDomainsResource;
};

const filterDomainsByDnsName = (domains, dnsName) => {
    var filtered = _.filter(domains || [], domain =>
        domain.name && domain.name === dnsName);
    var existingDomain = _.first(filtered) || null;  
    return existingDomain;
};

export function mergeVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName) {
    return (dispatch) => {
        var verifyDomainResource = 
            tenantDomainsResource(verifyTenant, verifyLinkTemplates);
        dispatch({
            type: constants.MERGE_VERIFY_DOMAINS,
            payload: {
                promise:
                    axios.get(verifyDomainResource, jsonResp)
                        .then(getPayload)
                        .then(tenantDomains => {
                            if (!tenantDomains.domains || tenantDomains.domains.length === 0)
                            {
                                dispatch(createVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName));
                                return { existingDomain: null };
                            }
                            return { existingDomain: filterDomainsByDnsName(tenantDomains.domains, dnsName) };
                        })
                        .catch(error => {
                            if (!error || !error.response || error.response.status != 400) {
                                throw error;
                            }

                            var message = (error.response.data || {}).message || '';
                            if(message.indexOf(verifyTenantId(verifyTenant)) > 0
                                && message.indexOf('is not registered') > 0 ) {
                                dispatch(enrollVerifyDomain(verifyTenant, verifyLinks));
                            }
                            else {
                                throw error;
                            }
                        })
            }
        })
    }
};

function enrollVerifyDomain(verifyTenant, verifyLinks, dnsName) {
    var enrollLink = _.find(verifyLinks, { 'rel': 'easyid:enrollment' });
    var cfg = window.config;
    var payload = {
        tenantId: verifyTenantId(verifyTenant),
        entityId : verifyTenant.entityIdentifier,
        domainName: dnsName
    };
    return (dispatch) => {
        dispatch({
            type: constants.ENROLL_VERIFY_DOMAIN,
            payload: {
                promise: 
                    axios.post(
                        enrollLink.href,
                        payload,
                        {
                            headers: {
                                'Content-Type' : contentType('enrollment')
                            }
                        }
                    ).then(getPayload)
                    .then(p => {
                        dispatch(mergeVerifyDomain(verifyTenant, verifyLinkTemplates, verifyLinks, dnsName));
                        return p;                        
                    })
            }
        })
    }
};

function createVerifyDomain(verifyTenant, verifyLinkTemplates, dnsName) {
    var verifyDomainsResource = 
        tenantDomainsResource(verifyTenant, verifyLinkTemplates);
    var payload = {
        name: dnsName,
        production: false
    };
    return (dispatch) => {
        dispatch({
            type: constants.CREATE_VERIFY_DOMAIN,
            payload: {
                promise: 
                    axios.post(
                        verifyDomainsResource,
                        payload,
                        {
                            headers: {
                                'Content-Type' : contentType('domain')
                            }
                        }
                    ).then(getPayload)
                    .then(r => {
                        return { existingDomain : filterDomainsByDnsName(r.domains, dnsName) };
                    })
            }
        })
    }
};

export function mergeVerifyApplications(verifyDomain) {
    var applicationsLink = _.find(verifyDomain.links, { 'rel': 'easyid:applications' });
    return (dispatch) => {
        dispatch({
            type: constants.MERGE_VERIFY_APPLICATIONS,
            payload: {
                promise: 
                    axios.get(applicationsLink.href, jsonResp)
                        .then(getPayload)
                        .then(r => {
                            if (_.find(r.applications, { realm: verifyRealm() })) {
                                return r;
                            } else {
                                var payload = verifyApplication();
                                return axios.post(
                                    applicationsLink.href,
                                    payload,
                                    {
                                        headers: {
                                            'Content-Type': contentType('application')
                                        }    
                                }).then(getPayload)
                            }
                        })
            }
        })
    }
};