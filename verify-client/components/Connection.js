import React from 'react';

const Connection = (props) => {
  return (
    <div className="container">
      <div className="row">
        <h3>{props.Name} (id: {props.id})</h3>
      </div>
    </div>
  );
};

export default Connection;