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
            promise: axios.post('/api/connections/search',
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

export function createConnections(connections) {
    return (dispatch, getState) => {
        var state = getState();
        var registeredTenants = state.verifyTenants.get('registeredTenants').toJS();
        dispatch({
            type: constants.CREATE_CONNECTIONS,
            payload: {
                promise: Promise.all(
                    _.map(connections, connection => 
                        axios.post('/api/connections',
                            connection,
                            requestConfig()))
                ).then(dispatch(findConnections(registeredTenants)))
            }
        })
    }
}