import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyTenant from './VerifyTenant';
import { toJS } from 'immutable';
import {tryToJS} from '../dsl';
import Connections from './Connections';
import { updateConnection } from '../actions/connection';

class Section extends Component {
  static propTypes = {
    user: PropTypes.object,
    connections: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
    updateConnection: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <section id="one" className="wrapper style2 special flow">
        <header className="major">
          <h2>Hi there, {this.props.user.get("name")} (email: {this.props.user.get("email")})</h2>
        </header>
        <header className="major">
          <h3><VerifyTenant/></h3>
        </header>
        <header className="major">
          <h2><Connections connections={this.props.connections} clients={this.props.clients} updateConnection={this.props.updateConnection}/></h2>
        </header>
      </section>
    );
  }

}
;

function mapStateToProps(state) {
  return {
    user: state.auth.get('user'),
    connections: state.connections.get('records').toJS(),
    clients: state.clients.get('clients').toJS()
  };
}

const mapDispatchToProps = {updateConnection}
export default connect(mapStateToProps, mapDispatchToProps)(Section);