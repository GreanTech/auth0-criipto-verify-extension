import { fromJS } from 'immutable';

import * as constants from '../../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  clients: []
};

export const clients = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_CLIENTS_PENDING]: (state) =>
    state.merge({
      loading: true,
      error: null
    }),
  [constants.FETCH_CLIENTS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the clients: ${action.errorMessage}`
    }),
  [constants.FETCH_CLIENTS_FULFILLED]: (state, action) =>
    state.merge({
      loading: false,
      error: null,
      clients: fromJS(action.payload.data)
    })
});
