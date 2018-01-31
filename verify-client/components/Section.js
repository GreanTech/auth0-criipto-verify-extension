import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyLink from './VerifyLink';
import VerifyTenant from './VerifyTenant';
import Connection from './Connection';
import { toJS } from 'immutable';
import {createVerifyTenant} from '../actions/verify';

class Section extends Component {
  static propTypes = {
    user: PropTypes.object,
    tenantsLoading: PropTypes.bool.isRequired,
    createVerifyTenant : PropTypes.func.isRequired,
    existingTenant: PropTypes.object.isRequired,
    domainLoading: PropTypes.bool.isRequired,
    existingDomain: PropTypes.object,
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
          <h2>Existing connections</h2>
        </header>
        {
          this.props.connections && this.props.connections.map((connection) => {
            if (!connection)
              return <div></div>
            return (
              <Connection key={connection.id} id={connection.id} Name={connection.name}/>
            )
          })
        }
        <header className="major">
          <h2>Links from Criipto Verify root</h2>
        </header>
        {
          this.props.verifyLinks && this.props.verifyLinks.map((verifyLink) => {
            if (!verifyLink)
              return <div></div>
            return (
              <VerifyLink key={verifyLink.href} Obj={verifyLink} isComplete={false} Name={verifyLink.rel}/>
            )
          })
        }
      </section>
    );
  }

}
;

function mapStateToProps(state) {
  return {
    user: state.auth.get('user'),
    verifyLinks: state.verifyLinks.get('links').toJS(),
    verifyTenants: state.verifyTenants.get('tenants').toJS(),
    connections: state.connections.get('records').toJS(),
    tenantsLoading: state.verifyTenants.get('loading'),
    existingTenant: state.verifyTenants.get('existingTenant').toJS(),
    domainLoading: state.verifyDomains.get('loading')
  };
}

const mapDispatch = {createVerifyTenant};
export default connect(mapStateToProps, mapDispatch)(Section);