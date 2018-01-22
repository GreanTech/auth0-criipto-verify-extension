import React from 'react';
import { connect } from 'react-redux';

const GaussLink = (props) => {
  return (
    <div className="container">
      <div className="row">
        <h3 style={{textDecoration: props.isComplete ? "line-through" : "none"}}>{props.Name}</h3>
      </div>
    </div>
  );
};

export default connect(null)(GaussLink);