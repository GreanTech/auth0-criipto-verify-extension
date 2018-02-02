import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {createVerifyTenant} from '../actions/verify';
import VerifyDomain from './VerifyDomain';
import {tryToJS} from '../dsl';

class VerifyTenant extends Component {
  static propTypes = {
    user: PropTypes.object,
    tenantsLoading: PropTypes.bool.isRequired,
    createVerifyTenant : PropTypes.func.isRequired,
    existingTenant: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.createTenant = this.createTenant.bind(this);
  }

  createTenant = () => {
    this.props.createVerifyTenant(
      this.props.user, 
      this.props.verifyLinks,
      this.props.verifyLinkTemplates);
  }

  
  render() {
    if (this.props.tenantsLoading) {
      return (<span>Checking for existing Criipto Verify tenants</span>);
    } else if (this.props.existingTenant && this.props.existingTenant.entityIdentifier) {
      return (
        <section>
          <span>
            OK, existing Criipto Verify tenant found: {this.props.existingTenant.name}
          </span>
          <VerifyDomain/>
        </section>     
      );
    } else {
      return (
        <span>No Criipto Verify tenant found &nbsp;
            <button className="btn btn-default" onClick={this.createTenant}>Create one</button>
        </span>
      );
    }
  } 
};

function mapStateToProps(state) {
  return {
    user: state.auth.get('user'),
    verifyLinks: tryToJS(state.verifyLinks.get('links')),
    verifyLinkTemplates: tryToJS(state.verifyLinks.get('linkTemplates')),
    tenantsLoading: state.verifyTenants.get('loading'),
    existingTenant: state.verifyTenants.get('existingTenant').toJS(),
  };
};

const mapDispatch = {createVerifyTenant}
export default connect(mapStateToProps, mapDispatch)(VerifyTenant);