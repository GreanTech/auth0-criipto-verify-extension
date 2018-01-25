import axios from 'axios';
import * as constants from '../constants';

export function fetchConnections() { // eslint-disable-line import/prefer-default-export
    return {
        type: constants.FETCH_CONNECTIONS,
        payload: {
            promise: axios.get('/api/connections', {
                headers : {
                    'Authorization' : 'Bearer ' + sessionStorage.getItem('delegated-admin:apiToken')
                },
                responseType: 'json'
            })
        }
    };
}
