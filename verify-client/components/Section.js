import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyTenant from './VerifyTenant';
import { toJS } from 'immutable';
import Connections from './Connections';

class Section extends Component {
  static propTypes = {
    user: PropTypes.object
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
          <h2>
            <Connections/>
          </h2>
        </header>
      </section>
    );
  }
};

function mapStateToProps(state) {
  return {
    user: state.auth.get('user')
  };
}

export default connect(mapStateToProps)(Section);