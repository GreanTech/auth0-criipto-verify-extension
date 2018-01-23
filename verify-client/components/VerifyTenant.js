import React from 'react';
import { connect } from 'react-redux';

const VerifyTenant = (props) => {
  return (
    <div className="container">
      <div className="row">
        <h3>{props.Name}</h3>
      </div>
    </div>
  );
};

export default connect(null)(VerifyTenant);