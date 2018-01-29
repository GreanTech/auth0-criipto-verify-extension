import axios from "axios";
import * as constants from '../constants';
import _ from 'lodash'; 

const getPayload = (response) => { return response.data; }

export function getVerifyTenants() { // = () => dispatch => {
    return { 
        type: constants.FETCH_VERIFY_TENANTS,
        payload: {
            promise:
                axios.get(window.config.GAUSS_API_ROOT, { responseType: 'json' })
                    .then(getPayload)
                    .then((gaussRoot) => {
                        var scopedClaimsLink = _.find(
                            gaussRoot.linkTemplates, 
                            { 'rel': 'gauss:scoped-user-claims' });
                        if (scopedClaimsLink)
                        {
                            // User has already onboarded before
                            var scopedClaimsRef = scopedClaimsLink.href.replace(
                                '{application}', 
                                window.btoa(window.config.VERIFY_GAUSS_APP_ID));
                            return axios.get(scopedClaimsRef)
                                .then(getPayload)
                                .then((scopedClaims) => { 
                                    return scopedClaims.claimScopes; 
                                });
                        } 
                        else
                        {
                            // Unknown user
                            return [];
                        }
                    })
                    // .then((claimScopes) => {
                    //     dispatch(verifyTenants(claimScopes))
                    // })
                    // .catch((err) => {
                    //     console.error.bind(err);
                    // })
        }
    }
};