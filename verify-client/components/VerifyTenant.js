import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {createVerifyTenant, checkDomainAvailable, enrollVerifyDomain} from '../actions/verify';
import VerifyDomain from './VerifyDomain';
import CheckDomainForm from './CheckDomainForm';
import {tryToJS} from '../dsl';
import './Styles.css';
import { Error } from 'auth0-extension-ui';

class VerifyTenant extends Component {
  static propTypes = {
    user: PropTypes.object,
    intent: PropTypes.string,
    tenantsLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
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

  hasExistingTenant(props) {
    return props.existingTenant && props.existingTenant.entityIdentifier;
  }

  isDomainAvailable(props) {
    return props.domainStatus && props.domainStatus.available;
  }
  
  componentDidUpdate(prevProps) {
    // When core verify data are loaded, no tenant was found, and the user intended
    // to create one, trigger tenant creation
    var tenantLoadingJustCompleted = prevProps.tenantsLoading && !this.props.tenantsLoading;
    if (this.props.intent === 'create'  
      && tenantLoadingJustCompleted
      && this.isDomainAvailable(this.props)
      && !this.hasExistingTenant(this.props)) {
      this.createTenant();
    }

    var domainBecameAvailable = 
      !this.isDomainAvailable(prevProps) 
      && this.isDomainAvailable(this.props);
    // Detect when an available domain has been found and Gauss tenant did not get registered properly in Verify
    if (domainBecameAvailable
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
    if (this.props.error) {
      return (<Error message={this.props.error} />);
    } else if (this.props.tenantsLoading) {
      return (<span>Checking the status of your Criipto Verify tenant</span>);
    } else if (this.props.renewingAuthentication) {
      return (<span>Hang on while we refresh your login session</span>);
    } else if (!this.props.domainStatus) {
      return (<span>Checking for availability of Criipto Verify DNS domain</span>);
    } else if (this.hasExistingTenant(this.props)) {
      return (
        <div>
          <h5>Criipto Verify tenant details</h5>
          Tenant name: {this.props.existingTenant.name}
          <VerifyDomain/>
        </div>     
      );
    } else if (!this.isDomainAvailable(this.props)) {
      return (
        <div className='row col-xs-12'>
          <h4>
            <p>Well, isn't that just typical! It looks like someone else has already reserved the DNS domain: <code>{this.props.domainStatus.nameCandidate}</code></p>
            <p>
              Fortunately, that particular value was just a guess we made, based on your Auth0 tenants DNS name.<br/>
              We'll need your assistance with selecting a new one of your liking:
            </p>
          </h4>
          <CheckDomainForm onCheck={this.checkAvailability}/>
        </div>
      );
    } else {
      var activeElement = 
        this.state.creatingTenant ? 
          <div>Creating Criipto Verify tenant
            <div className="loader"></div>
          </div>
          : <span>No Criipto Verify tenant found &nbsp;
              <button className="btn btn-default" onClick={this.createTenant}>
                Create one
              </button>
            </span>;

      return (
        <h4>{activeElement}</h4>
      );
    }
  } 
};

function mapStateToProps(state) {
  return {
    user: state.auth.get('user'),
    intent: state.verifyTenants.get('intent'),
    verifyLinks: tryToJS(state.verifyLinks.get('links')),
    verifyLinkTemplates: tryToJS(state.verifyLinks.get('linkTemplates')),
    tenantsLoading: state.verifyTenants.get('loading'),
    error : state.verifyTenants.get('error'),
    existingTenant: state.verifyTenants.get('existingTenant').toJS(),
    tenants: state.verifyTenants.get('tenants').toJS(),
    renewingAuthentication: state.auth.get('renewingAuthentication'),
    domainStatus: tryToJS(state.checkDomainAvailable.get('domainStatus'))
  };
};

const mapDispatch = {checkDomainAvailable, enrollVerifyDomain, createVerifyTenant}
export default connect(mapStateToProps, mapDispatch)(VerifyTenant);