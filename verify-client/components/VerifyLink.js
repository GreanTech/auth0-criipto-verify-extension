import React from 'react';
import { connect } from 'react-redux';

const VerifyLink = (props) => {
  return (
    <div className="container">
      <div className="row">
        {/* <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" onClick={() => {
            props.putChangeStatus(props.Obj, props.isComplete)}} className="btn">{props.isComplete ? "Undo" : "Complete" }</button>
          <button type="button" onClick={() => props.deleteTask(props.Obj.slug)} className="btn">Delete</button>
        </div> */}
        <h3 style={{textDecoration: props.isComplete ? "line-through" : "none"}}>{props.Name}</h3>
      </div>
    </div>
  );
};

export default connect(null)(VerifyLink);