import React, { Component, PropTypes } from 'react';

const VerifyApplication = ({existingApplication}) => (
    <div>Application name: {existingApplication.name}</div>
);

VerifyApplication.propTypes = {
    existingApplication: PropTypes.object.isRequired
}

export default VerifyApplication;