import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { mergeVerifyApplications } from '../actions/verify';
import _ from 'lodash';
import { tryToJS } from '../dsl';
import VerifyApplication from '../components/VerifyApplication';

class VerifyApplicationContainer extends Component {
    static propTypes = {
        applicationLoading: PropTypes.bool.isRequired,
        existingDomain: PropTypes.object.isRequired,
        mergeVerifyApplications: PropTypes.func.isRequired,
        existingApplication: PropTypes.object
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.mergeVerifyApplications(this.props.existingDomain);
    }

    render() {
        if (this.props.applicationLoading) {
            return (<span>Checking for existing Criipto Verify application</span>);
        } else if (this.props.existingApplication) {
            return (<VerifyApplication {...this.props}/>);
        } else {
            return (<span>No Criipto Verify application found - creating one...</span>);
        }
    }
}

const mapStateToProps = (state) => {
    return {
        applicationLoading: state.verifyApplications.get('loading'),
        existingDomain: state.verifyDomains.get('existingDomain').toJS(),
        existingApplication: tryToJS(state.verifyApplications.get('existingApplication'))
    };
};

const mapDispatchToProps = { mergeVerifyApplications };

export default connect(mapStateToProps, mapDispatchToProps)(VerifyApplicationContainer);
