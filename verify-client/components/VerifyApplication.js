import React, { Component, PropTypes } from 'react';

const VerifyApplication = ({existingApplication}) => (
    <section>
        <span>
            OK, existing Criipto Verify application found:
            {existingApplication.name}
        </span>
    </section>
);

VerifyApplication.propTypes = {
    existingApplication: PropTypes.object.isRequired
}

export default VerifyApplication;