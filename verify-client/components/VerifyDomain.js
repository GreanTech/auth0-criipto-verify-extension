import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchVerifyDomain, createVerifyDomain } from '../actions/verify';

class VerifyDomain extends Component {
    static propTypes = {
        domainLoading: PropTypes.bool.isRequired,
        existingTenant: PropTypes.object.isRequired,
        verifyLinks: PropTypes.array.isRequired,
        verifyLinkTemplates: PropTypes.array.isRequired,        
        fetchVerifyDomain: PropTypes.func.isRequired,
        createVerifyDomain: PropTypes.func.isRequired,
        existingDomain: PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.createDomain = this.createDomain.bind(this);
    }

    componentDidMount() {
        this.props.fetchVerifyDomain(this.props.existingTenant, this.props.verifyLinkTemplates);
    }

    createDomain = () => {
        this.props.createVerifyDomain(
            this.props.existingTenant,
            this.props.verifyLinks
        );
    }

    render() {
        if (this.props.domainLoading) {
            return (<span>Checking for existing Criipto Verify DNS domain</span>)
        } else if (this.props.existingDomain) {
            return (
                <span>
                    OK, existing Criipto Verify DNS domain found:
                    {this.props.existingDomain.name}
                </span>
            );
        } else {
            return <span>No Criipto Verify DNS domain found - creating one...</span>;
        }
    }
}

function tryToJS(candidate) {
    return candidate ? candidate.toJS() : null;
}

function mapStateToProps(state) {
    return {
        domainLoading: state.verifyDomains.get('loading'),
        existingDomain: tryToJS(state.verifyDomains.get('existingDomain')),
        verifyLinks: state.verifyLinks.get('links').toJS(),
        verifyLinkTemplates: state.verifyLinks.get('linkTemplates').toJS(),
        existingTenant: state.verifyTenants.get('existingTenant').toJS(),
    };
};

const mapDispatch = { fetchVerifyDomain, createVerifyDomain }
export default connect(mapStateToProps, mapDispatch)(VerifyDomain);
