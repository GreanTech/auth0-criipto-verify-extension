module.exports = {
    ID_SERVICE_PROFILES: {
        'auth0-criipto-verify-admin-dk-nemid': {
            'displayName': "Danish NemID",
            'logo': 'https://www.criipto.com/images/logo-e-id-dk-nemid.svg',
            'acrValues': [
                "urn:grn:authn:dk:nemid:poces",
                "urn:grn:authn:dk:nemid:moces",
                "urn:grn:authn:dk:nemid:moces:codefile"
            ],
            'subpath': 'dknemid',
            'description': 'This extension manages connections to Danish NemID via Criipto Verify.'
        },
        'auth0-criipto-verify-admin-se-bankid': {
            'displayName': "Swedish BankID",
            'logo': 'https://www.criipto.com/images/logo-e-id-se-bankid.svg',
            'acrValues': [
                "urn:grn:authn:se:bankid:same-device",
                "urn:grn:authn:se:bankid:another-device"
            ],
            'subpath': 'sebankid',
            'description': 'This extension manages connections to Swedish BankID via Criipto Verify.'
        },
        'auth0-criipto-verify-admin-no-bankid': {
            'displayName': "Norwegian BankID",
            'logo': 'https://www.criipto.com/images/logo-e-id-no-bankid.svg',
            'acrValues': [
                "urn:grn:authn:no:bankid:central",
                "urn:grn:authn:no:bankid:mobile",
            ],
            'subpath': 'nobankid',
            'description': 'This extension manages connections to Norwegian BankID via Criipto Verify.'
        },
        'auth0-criipto-verify-admin-nl-digid': {
            'displayName': "Dutch DigiD",
            'logo': 'https://www.criipto.com/images/logo-e-id-nl-digid.svg',
            'acrValues': [
                "urn:grn:authn:nl:digid:basic",
                "urn:grn:authn:nl:digid:middle",
                "urn:grn:authn:nl:digid:substantial",
                "urn:grn:authn:nl:digid:high"
            ],
            'subpath': 'nldigid',
            'description': 'This extension manages connections to Dutch DigiD via Criipto Verify.'
        },
        'auth0-criipto-verify-admin': {
            'displayName': "",
            'logo': 'https://www.criipto.com/images/logo-criipto-dark-3.svg',
            'acrValues': [
                "urn:grn:authn:dk:nemid:poces",
                "urn:grn:authn:dk:nemid:moces",
                "urn:grn:authn:dk:nemid:moces:codefile",
                "urn:grn:authn:se:bankid:same-device",
                "urn:grn:authn:se:bankid:another-device",
                "urn:grn:authn:no:bankid:central",
                "urn:grn:authn:no:bankid:mobile",
                "urn:grn:authn:nl:digid:basic",
                "urn:grn:authn:nl:digid:middle",
                "urn:grn:authn:nl:digid:substantial",
                "urn:grn:authn:nl:digid:high"
            ],
            'subpath': 'all',
            'description': 'This extension manages various e-ID connections via Criipto Verify.'
        }
    }
};