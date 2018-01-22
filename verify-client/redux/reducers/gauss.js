import axios from "axios";
/////////////////CONSTANTS/////////////////////

const GET_GAUSS_LINKS = "GET_GAUSS_LINKS";

/////////////////ACTIONS//////////////

const gaussLinks = (gaussRoot) => ({type: GET_GAUSS_LINKS, gaussRoot});

/////////////////REDUCER/////////////////////

//initiate your starting state
let initial = {
  gaussLinks: [],
  gaussLinkTemplates: []
};

export const gauss = (state = initial, action) => {

  switch (action.type) {
    case GET_GAUSS_LINKS:
      return Object.assign(
            {}, 
            state, 
            {
                gaussLinks: action.gaussRoot.links, 
                gaussLinkTemplates: action.gaussRoot.linkTemplates
            });
    default:
      return state;
  }

};

/////////////// ACTION DISPATCHER FUNCTIONS///////////////////

export const getGaussLinks = () => dispatch => {
  axios.get(window.config.GAUSS_API_ROOT)
    .then((response) => {
      return response.data;
    })
    .then((gaussRoot) => {
      dispatch(gaussLinks(gaussRoot))
    })
    .catch((err) => {
      console.error.bind(err);
    })
};