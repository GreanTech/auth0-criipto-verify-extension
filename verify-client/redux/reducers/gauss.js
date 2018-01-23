import axios from "axios";
import _ from 'lodash'; 
/////////////////CONSTANTS/////////////////////

const GET_VERIFY_TENANTS = "GET_VERIFY_TENANTS";

/////////////////ACTIONS//////////////

const verifyTenants = (tenants) => ({type: GET_VERIFY_TENANTS, verifyTenants : tenants});

/////////////////REDUCER/////////////////////

//initiate your starting state
let initial = {
  verifyTenants: []
};

export const gauss = (state = initial, action) => {

  switch (action.type) {
    case GET_VERIFY_TENANTS:
      return _.assign({}, state, { verifyTenants: action.verifyTenants });
    default:
      return state;
  }

};

/////////////// ACTION DISPATCHER FUNCTIONS///////////////////

const getPayload = (response) => { return response.data; }
export const getVerifyTenants = () => dispatch => {
  axios.get(window.config.GAUSS_API_ROOT)
    .then((response) => {
      return response.data;
    })
    .then((gaussRoot) => {
        var scopedClaimsLink = _.find(gaussRoot.linkTemplates, { 'rel': 'gauss:scoped-user-claims' });
        if (scopedClaimsLink)
        {
            // User has already onboarded before
            var scopedClaimsRef = scopedClaimsLink.href.replace('{application}', window.btoa(window.config.VERIFY_GAUSS_APP_ID));
            return axios.get(scopedClaimsRef)
                .then(getPayload)
                .then((scopedClaims) => { return scopedClaims.claimScopes; });
        } 
        else
        {
            // Unknown user
            return [];
        }
    })
    .then((claimScopes) => {
      dispatch(verifyTenants(claimScopes))
    })
    .catch((err) => {
      console.error.bind(err);
    })
};