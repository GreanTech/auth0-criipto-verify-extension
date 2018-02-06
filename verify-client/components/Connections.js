import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Connection from './Connection';

const Connections = ({connections, clients, updateConnection}) => {
    var cs = _.filter(connections, c => !!c);
    if (!cs) {
        return (
            <span>No Auth0 connection to your Criipto Verify tenant found &nbsp;
                <button className="btn btn-default" onClick={this.createAuth0Connection}>Create one</button>
            </span>
          );
    }

    return (
        <section>
            <h4>Existing Auth0 connections to Criipto Verify</h4>
            { 
                <div className="col-xs-5">
                    {
                        _.map(cs, connection => 
                            <Connection key={connection.id} 
                                connection={connection} clients={clients}
                                onSubmit={updateConnection}/>)
                    } 
                </div>
            }
        </section>
    );
};

Connections.propTypes = {
    connections: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    updateConnection: PropTypes.func.isRequired
}

export default Connections;