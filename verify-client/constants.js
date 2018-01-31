/*
 * Auth.
 */

// Token.
export const LOADED_TOKEN = 'LOADED_TOKEN';
export const RECIEVED_TOKEN = 'RECIEVED_TOKEN';

// Login.
export const SHOW_LOGIN = 'SHOW_LOGIN';
export const REDIRECT_LOGIN = 'REDIRECT_LOGIN';
export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// Logout.
export const LOGOUT_PENDING = 'LOGOUT_PENDING';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

/*
 * Connections.
 */

// Fetch.
export const FETCH_CONNECTIONS = 'FETCH_CONNECTIONS';
export const FETCH_CONNECTIONS_PENDING = 'FETCH_CONNECTIONS_PENDING';
export const FETCH_CONNECTIONS_REJECTED = 'FETCH_CONNECTIONS_REJECTED';
export const FETCH_CONNECTIONS_FULFILLED = 'FETCH_CONNECTIONS_FULFILLED';

/*
 * Criipto Verify 
 */

export const GAUSS_ENTITY_ID = 
    'urn:grn:entityid:organization:verify:auth0:1:'
        + window.config.AUTH0_DOMAIN;

export const VERIFY_TENANT_ID_PREFIX = 'urn:grn:verify:auth0:tenant:';

// Fetch tenants
export const FETCH_VERIFY_TENANTS = "FETCH_VERIFY_TENANTS";
export const FETCH_VERIFY_TENANTS_PENDING = 'FETCH_VERIFY_TENANTS_PENDING';
export const FETCH_VERIFY_TENANTS_REJECTED = 'FETCH_VERIFY_TENANTS_REJECTED';
export const FETCH_VERIFY_TENANTS_FULFILLED = 'FETCH_VERIFY_TENANTS_FULFILLED';

// Fetch links
export const FETCH_VERIFY_LINKS = "FETCH_VERIFY_LINKS";
export const FETCH_VERIFY_LINKS_PENDING = 'FETCH_VERIFY_LINKS_PENDING';
export const FETCH_VERIFY_LINKS_REJECTED = 'FETCH_VERIFY_LINKS_REJECTED';
export const FETCH_VERIFY_LINKS_FULFILLED = 'FETCH_VERIFY_LINKS_FULFILLED';

// Create tenant
export const CREATE_VERIFY_TENANT = "CREATE_VERIFY_TENANT";
export const CREATE_VERIFY_TENANT_PENDING = "CREATE_VERIFY_TENANT_PENDING";
export const CREATE_VERIFY_TENANT_REJECTED = "CREATE_VERIFY_TENANT_REJECTED";
export const CREATE_VERIFY_TENANT_FULFILLED = "CREATE_VERIFY_TENANT_FULFILLED";

// Fetch domain
export const FETCH_VERIFY_DOMAINS = "FETCH_VERIFY_DOMAINS";
export const FETCH_VERIFY_DOMAINS_PENDING = "FETCH_VERIFY_DOMAINS_PENDING";
export const FETCH_VERIFY_DOMAINS_REJECTED = "FETCH_VERIFY_DOMAINS_REJECTED";
export const FETCH_VERIFY_DOMAINS_FULFILLED = "FETCH_VERIFY_DOMAINS_FULFILLED";

// Create domain
export const CREATE_VERIFY_DOMAIN = "CREATE_VERIFY_DOMAIN";
export const CREATE_VERIFY_DOMAIN_PENDING = "CREATE_VERIFY_DOMAIN_PENDING";
export const CREATE_VERIFY_DOMAIN_REJECTED = "CREATE_VERIFY_DOMAIN_REJECTED";
export const CREATE_VERIFY_DOMAIN_FULFILLED = "CREATE_VERIFY_DOMAIN_FULFILLED";

// Fetch application
export const FETCH_VERIFY_APPLICATION = "FETCH_VERIFY_APPLICATION";
export const FETCH_VERIFY_APPLICATION_PENDING = "FETCH_VERIFY_APPLICATION_PENDING";
export const FETCH_VERIFY_APPLICATION_REJECTED = "FETCH_VERIFY_APPLICATION_REJECTED";
export const FETCH_VERIFY_APPLICATION_FULFILLED = "FETCH_VERIFY_APPLICATION_FULFILLED";
