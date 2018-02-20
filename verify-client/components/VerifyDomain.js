import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import VerifyApplication from '../containers/VerifyApplication';
import CheckDomainForm from './CheckDomainForm';
import './Styles.css';

class VerifyDomain extends Component {
    static propTypes = {
        domainLoading: PropTypes.bool.isRequired,
        existingDomain: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.domainLoading) {
            return (<span>Checking for existing Criipto Verify DNS domain</span>);
        } else {
            return (
                <div>
                    DNS domain: {this.props.existingDomain.name}
                    <VerifyApplication/>
                </div>
                );
        }
    }
}

function mapStateToProps(state) {
    return {
        domainLoading: state.verifyDomains.get('loading'),
        existingDomain: state.verifyDomains.get('existingDomain').toJS()
    };
};

export default connect(mapStateToProps)(VerifyDomain);
