import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchVerifyApplications } from '../actions/verify';
import _ from 'lodash';
import { tryToJS } from '../dsl';
import VerifyApplication from '../components/VerifyApplication';

class VerifyApplicationContainer extends Component {
    static propTypes = {
        applicationLoading: PropTypes.bool.isRequired,
        existingDomain: PropTypes.object.isRequired,
        fetchVerifyApplications: PropTypes.func.isRequired,
        existingApplication: PropTypes.object
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchVerifyApplications(this.props.existingDomain);
    }

    render() {
        if (this.props.applicationLoading) {
            return (<section><span>Checking for existing Criipto Verify application</span></section>);
        } else if (this.props.existingApplication) {
            return (<VerifyApplication {...this.props}/>);
        } else {
            return (<section><span>No Criipto Verify application found - creating one...</span></section>);
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

const mapDispatchToProps = { fetchVerifyApplications };

export default connect(mapStateToProps, mapDispatchToProps)(VerifyApplicationContainer);
