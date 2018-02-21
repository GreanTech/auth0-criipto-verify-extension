import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyTenant from './VerifyTenant';
import { toJS } from 'immutable';

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
          <h3>Hi there, {this.props.user.get("name")} (email: {this.props.user.get("email")})</h3>
        </header>
        <VerifyTenant/>
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