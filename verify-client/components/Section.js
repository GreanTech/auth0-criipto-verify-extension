import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import VerifyLink from './VerifyLink';
import VerifyTenant from './VerifyTenant';

class Section extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section id="one" className="wrapper style2 special flow">
        <header className="major">
          <h2>Hi there, {this.props.user.get("name")} (email: {this.props.user.get("email")})</h2>
        </header>
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
        <header className="major">
          <h2>Existing Verify Tenants (from Gauss)</h2>
        </header>
        {
          this.props.verifyTenants && this.props.verifyTenants.map((verifyTenant) => {
            var org = verifyTenant.organization;
            if (!org)
              return <div></div>
            return (
              <VerifyTenant key={org.entityIdentifier} Obj={org} isComplete={false} Name={org.name}/>
            )
          })
        }
      </section>
    );
  }

}
;

const mapState = ({verifyLinks, verifyTenants}) => ({verifyLinks, verifyTenants});
function mapStateToProps(state) {
  return {
    user: state.auth.get('user'),
    verifyLinks: state.verify.verifyLinks,
    verifyTenants: state.gauss.verifyTenants
  };
}
export default connect(mapStateToProps)(Section);