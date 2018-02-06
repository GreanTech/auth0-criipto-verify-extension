import axios from 'axios';
import * as constants from '../constants';

function requestConfig() {
    return { 
        headers : {
            "Authorization" : 'Bearer ' + sessionStorage.getItem('delegated-admin:apiToken')
        },
        responseType: 'json'
    }
}

export function findConnections(registeredTenants) {
    return {
        type: constants.FETCH_CONNECTIONS,
        payload: {
            promise: axios.post('/api/connections',
                { registeredTenants : registeredTenants },
                requestConfig()
            )            
        }
    }
}

export function updateConnection(connection) {
    return {
        type: constants.UPDATE_CONNECTION,
        payload: {
            promise: axios.patch('/api/connections/' + connection.id,
                connection,
                requestConfig()
            )
        }
    }
}