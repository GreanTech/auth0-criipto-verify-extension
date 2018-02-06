import axios from 'axios';
import * as constants from '../constants';

export function fetchClients() {
    return {
        type: constants.FETCH_CLIENTS,
        payload: {
            promise: axios.get('/api/clients',
                { 
                    headers : {
                        'Authorization' : 'Bearer ' + sessionStorage.getItem('delegated-admin:apiToken')
                    },
                    responseType: 'json',                
                }
            )            
        }
    }
}