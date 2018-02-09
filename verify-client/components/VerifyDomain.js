import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
        existingDomain: PropTypes.object,
    }

    constructor(props) {
        super(props);
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

export default connect(mapStateToProps)(VerifyDomain);
