import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Switchbox from './Switchbox';

class Connection extends Component {
  static propTypes = {
    connection: PropTypes.object.isRequired,
    clients: PropTypes.array.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    var seed = {};
    _.forEach(this.props.clients, c => seed[c] = false);
    _.forEach(this.props.connection.enabled_clients, c => seed[c] = true);
    this.state = { 
      enabledClients: seed
    };

    this.isEnabled = this.isEnabled.bind(this);
    this.toggleEnabled = this.toggleEnabled.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isEnabled(client) {
    return this.state.enabledClients[client.client_id];
  }

  toggleEnabled(clientId) {
    var newState = _.assign({}, this.state);
    newState.enabledClients[clientId] = !this.state.enabledClients[clientId];
    this.setState(newState)
  }

  handleSubmit(event) {
    event.preventDefault();
    var newConnection = _.assign({}, this.props.connection);
    newConnection.enabled_clients = 
      _.flatten(_.map(this.state.enabledClients, (val, key) => {
        if (val) {
          return [key];
        } else {
          return [];
        }
      }));
    this.props.onSubmit(newConnection);
  }

  render() {
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div>
          <h5><code>{this.props.connection.name}</code></h5>
          <table className="table data-table enterprise-connections">
            <thead>
              <tr><td>Client</td><td>Enabled</td></tr>
            </thead>
            <tbody>
            {
              _.map(this.props.clients, c =>
                  <tr key={c.client_id}>
                    <td style={{width: '70%'}}>{c.name}</td>
                    <td style={{width: '30%'}}>
                      <Switchbox key={c.client_id} label={c.client_id} isChecked={this.isEnabled(c)} onChange={this.toggleEnabled} />
                    </td>
                  </tr>
              )
            }
            </tbody>
          </table>

          <div className="modal-footer">
            <div className="action-element">
              <div className="form-group">    
                <input 
                  type="submit" 
                  className="btn btn-primary save-applications" 
                  data-loading-text="Saving..." value="Save" />
              </div>
            </div>
          </div>

        </div>
      </form>
    );
  }
};

export default Connection;