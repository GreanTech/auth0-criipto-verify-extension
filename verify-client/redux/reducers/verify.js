import axios from "axios";
/////////////////CONSTANTS/////////////////////

const GET_VERIFY_LINKS = "GET_VERIFY_LINKS";

/////////////////ACTIONS//////////////

const verifyLinks = (verifyRoot) => ({type: GET_VERIFY_LINKS, verifyRoot});

/////////////////REDUCER/////////////////////

//initiate your starting state
let initial = {
  verifyLinks: []
};

export const verify = (state = initial, action) => {

  switch (action.type) {
    case GET_VERIFY_LINKS:
      return Object.assign({}, state, {verifyLinks: action.verifyRoot.links});
    default:
      return state;
  }

};

/////////////// ACTION DISPATCHER FUNCTIONS///////////////////

export const getVerifyLinks = () => dispatch => {
  axios.get(window.config.VERIFY_API_ROOT)
    .then((response) => {
      return response.data;
    })
    .then((verifyRoot) => {
      dispatch(verifyLinks(verifyRoot))
    })
    .catch((err) => {
      console.error.bind(err);
    })
};