import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import Connection from './Connection';
import { toJS } from 'immutable';
import { updateConnection, createConnections } from '../actions/connection';
import { tryToJS } from '../dsl';
import { Error } from 'auth0-extension-ui';

class Connections extends Component {
    static propTypes = {
        connections: PropTypes.array,
        clients: PropTypes.array,
        updateConnection: PropTypes.func.isRequired,
        createConnections: PropTypes.func.isRequired,
        existingDomain: PropTypes.object,
        creating: PropTypes.bool.isRequired,
        error: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.creating || this.props.creating 
            || !this.props.existingDomain
            || this.props.connections === null) {
            return;
        }

        var expectedConnections = 
            _.map(window.config.CRIIPTO_VERIFY_AUTHMETHODS, am => {
                var encodedAuthMethod = window.btoa(am);
                var connectionName = am.replace(/^urn:grn:authn:/, 'criipto-verify-').replace(/:/g, '-');
                return {
                    name: connectionName,
                    options: {
                        adfs_server: `https://${this.props.existingDomain.name}/${encodedAuthMethod}/FederationMetadata/2007-06/FederationMetadata.xml`
                    }
                };
            });
        var missingConnections = 
            _.isEmpty(this.props.connections) ?
                expectedConnections
                :    _.reject(expectedConnections, ec =>
                        _.filter(this.props.connections, ec))
            ;

        var connectionsAreMissing = missingConnections.length > 0;
        if (connectionsAreMissing)
        {
            this.props.createConnections(missingConnections);
        }
    }
    
    render() {
        var header = <h5>Manage clients for Auth0 connections to Criipto Verify</h5>;
        if (this.props.error) {
            return (
                <section>
                   {header}
                    <Error message={this.props.error} />
                </section>
            );
        }
        
        var cs = _.filter(this.props.connections, c => !!c);
        if (!cs || cs.length === 0) {
            return (<div></div>);
        }

        return (
            <section>
                {header}
                { 
                    <div className="col-xs-5">
                        {
                            _.map(cs, connection => 
                                <Connection key={connection.id} 
                                    connection={connection} clients={this.props.clients}
                                    onSubmit={this.props.updateConnection}/>)
                        } 
                    </div>
                }
            </section>
        );
    }
};

const mapStateToProps = (state) => ({
    connections: tryToJS(state.connections.get('records')),
    clients: tryToJS(state.clients.get('clients')),
    existingDomain: tryToJS(state.verifyDomains.get('existingDomain')),
    creating: state.connections.get('creating'),
    error: state.connections.get('error'),
});

const mapDispatchToProps = {updateConnection, createConnections}
export default connect(mapStateToProps, mapDispatchToProps)(Connections);
