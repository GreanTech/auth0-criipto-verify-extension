import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {createVerifyTenant, checkDomainAvailable, enrollVerifyDomain} from '../actions/verify';
import VerifyDomain from './VerifyDomain';
import CheckDomainForm from './CheckDomainForm';
import {tryToJS} from '../dsl';
import './Styles.css';

class VerifyTenant extends Component {
  static propTypes = {
    user: PropTypes.object,
    tenantsLoading: PropTypes.bool.isRequired,
    createVerifyTenant : PropTypes.func.isRequired,
    existingTenant: PropTypes.object.isRequired,
    renewingAuthentication: PropTypes.bool.isRequired,
    enrollVerifyDomain: PropTypes.func.isRequired,
    domainStatus: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { creatingTenant: false };
    this.createTenant = this.createTenant.bind(this);
    this.checkAvailability = this.checkAvailability.bind(this);
  }

  checkAvailability = (candidate) => {
    this.props.checkDomainAvailable(candidate);
  }

  componentDidUpdate(prevProps) {
    // Detect when an available domain has been found and Gauss tenant did not get registered properly in Verify
    if ((!prevProps.domainStatus || !prevProps.domainStatus.available)
        && this.props.domainStatus && this.props.domainStatus.available
        && this.props.tenants 
        && this.props.tenants.length > 0) {
        this.props.enrollVerifyDomain(
            _.first(this.props.tenants).organization,
            this.props.verifyLinkTemplates,
            this.props.verifyLinks,                
            this.props.domainStatus.nameCandidate);
    }        
}

createTenant = () => {
  this.setState({ creatingTenant: true });
  this.props.createVerifyTenant(
    this.props.user, 
    this.props.verifyLinks,
    this.props.verifyLinkTemplates);
  }

  render() {
    if (this.props.tenantsLoading) {
      return (<span>Checking for existing Criipto Verify tenants</span>);
    } else if (this.props.renewingAuthentication) {
      return (<span>Hang on while we refresh your login session</span>);
    } else if (!this.props.domainStatus) {
      return (<span>Checking for availability of Criipto Verify DNS domain</span>);
    } else if (this.props.existingTenant && this.props.existingTenant.entityIdentifier) {
      return (
        <section>
          <p>
            <span>
              OK, existing Criipto Verify tenant found: {this.props.existingTenant.name}
            </span>
            </p>
          <VerifyDomain/>
        </section>     
      );
    } else if (this.props.domainStatus && !this.props.domainStatus.available) {
      return (
          <section className="form-group">
            <p>
                Well, isn't that typical! It looks like someone else has already reserved the DNS domain: <code>{this.props.domainStatus.nameCandidate}</code>.</p>
            <p>
                Fortunately, that particular value was just a guess we made, based on your Auth0 tenants DNS name.<br/>
                We'll need your assistance with selecting a new one of your liking:
            </p>
            <CheckDomainForm onCheck={this.checkAvailability}/>
          </section>
      );
    } else {
      var activeElement = 
        this.state.creatingTenant ? 
          <div className="loader"></div>
          : <button className="btn btn-default" onClick={this.createTenant}>
              Create one
            </button>;

      return (
        <span>No Criipto Verify tenant found &nbsp;{activeElement}</span>
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
    tenants: state.verifyTenants.get('tenants').toJS(),
    renewingAuthentication: state.auth.get('renewingAuthentication'),
    domainStatus: tryToJS(state.checkDomainAvailable.get('domainStatus'))
  };
};

const mapDispatch = {checkDomainAvailable, enrollVerifyDomain, createVerifyTenant}
export default connect(mapStateToProps, mapDispatch)(VerifyTenant);