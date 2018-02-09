import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { mergeVerifyDomain } from '../actions/verify';
import _ from 'lodash';
import { tryToJS } from '../dsl';
import VerifyApplication from '../containers/VerifyApplication';
import CheckDomainForm from './CheckDomainForm';
import './Styles.css';

class VerifyDomain extends Component {
    static propTypes = {
        domainStatus: PropTypes.object.isRequired,
        domainLoading: PropTypes.bool.isRequired,
        existingTenant: PropTypes.object.isRequired,
        verifyLinks: PropTypes.array.isRequired,
        verifyLinkTemplates: PropTypes.array.isRequired,
        mergeVerifyDomain: PropTypes.func.isRequired,
        existingDomain: PropTypes.object,
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!this.props.existingDomain
            && this.props.domainStatus 
            && this.props.domainStatus.available            
            && _.find(this.props.verifyLinkTemplates, { 'rel': 'easyid:tenant-domains' })) {
            this.props.mergeVerifyDomain(
                this.props.existingTenant,
                this.props.verifyLinkTemplates,
                this.props.verifyLinks,                
                this.props.domainStatus.nameCandidate);
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
                <div>
                    DNS domain: {this.props.existingDomain.name}
                    <VerifyApplication/>
                </div>
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

const mapDispatch = { mergeVerifyDomain }
export default connect(mapStateToProps, mapDispatch)(VerifyDomain);
