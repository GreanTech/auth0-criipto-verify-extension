import React, { Component, PropTypes } from 'react';

const VerifyApplication = ({existingApplication}) => (
    <section>
        <span>
            OK, existing Criipto Verify application found:
            {this.props.existingApplication.name}
        </span>
    </section>
);

VerifyApplication.propTypes = {
    existingApplication: PropTypes.object.isRequired
}

export default VerifyApplication;