import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { mergeVerifyDomain, checkDomainAvailable } from '../actions/verify';
import _ from 'lodash';
import { tryToJS, defaultVerifyDnsName } from '../dsl';
import VerifyApplication from '../containers/VerifyApplication';
import CheckDomainForm from './CheckDomainForm';

class VerifyDomain extends Component {
    static propTypes = {
        domainStatus: PropTypes.object.isRequired,
        domainLoading: PropTypes.bool.isRequired,
        existingTenant: PropTypes.object.isRequired,
        verifyLinks: PropTypes.array.isRequired,
        verifyLinkTemplates: PropTypes.array.isRequired,
        mergeVerifyDomain: PropTypes.func.isRequired,
        checkDomainAvailable: PropTypes.func.isRequired,
        existingDomain: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.checkAvailability = this.checkAvailability.bind(this);
    }

    checkAvailability = (candidate) => {
        this.props.checkDomainAvailable(candidate);
    }

    componentDidMount() {
        if (!this.props.existingDomain
            && _.find(this.props.verifyLinkTemplates, { 'rel': 'easyid:tenant-domains' })) {
            this.props.mergeVerifyDomain(
                this.props.existingTenant,
                this.props.verifyLinkTemplates,
                this.props.verifyLinks,                
                defaultVerifyDnsName());
        }
    }

    componentDidUpdate(prevProps) {
        // Detect when suggested domain is one that is available
        if (!this.props.existingDomain
            && prevProps.domainStatus
            && !prevProps.domainStatus.available
            && this.props.domainStatus 
            && this.props.domainStatus.available) {
            this.props.mergeVerifyDomain(
                this.props.existingTenant,
                this.props.verifyLinkTemplates,
                this.props.verifyLinks,                
                this.props.domainStatus.nameCandidate);
        }        
    }

    render() {
        if (this.props.domainLoading) {
            return (<span>Checking for existing Criipto Verify DNS domain</span>);
        } else if (this.props.existingDomain) {
            return (
                <section>
                    <span>
                        OK, existing Criipto Verify DNS domain found:
                        {this.props.existingDomain.name}
                    </span>
                    <VerifyApplication/>
                </section>
            );
        } else if (this.props.domainStatus && !this.props.domainStatus.available) {
            return (
                <section className="form-group">
                    <p>
                        Crickey, it looks like someone else has reserved the domain: <code>{this.props.domainStatus.nameCandidate}</code>.</p>
                    <p>
                        That was a guess on our part, based on your Auth0 tenants DNS name.
                        We'll need your assistance with selecting a new one of your liking:
                    </p>
                    <CheckDomainForm onCheck={this.checkAvailability} placeholder={this.props.domainStatus.nameCandidate}/>
                </section>
            );
        } else {
            return (<span>No Criipto Verify DNS domain found - creating one...</span>);
        }
    }
}

function mapStateToProps(state) {
    return {
        domainStatus: tryToJS(state.checkDomainAvailable.get('domainStatus')),
        domainLoading: state.verifyDomains.get('loading'),
        existingDomain: tryToJS(state.verifyDomains.get('existingDomain')),
        verifyLinks: state.verifyLinks.get('links').toJS(),
        verifyLinkTemplates: state.verifyLinks.get('linkTemplates').toJS(),
        existingTenant: state.verifyTenants.get('existingTenant').toJS(),
    };
};

const mapDispatch = { mergeVerifyDomain, checkDomainAvailable }
export default connect(mapStateToProps, mapDispatch)(VerifyDomain);
