import React from "react";

const Success = (props) => {
  return (
    <div className="alert alert-success">
      <strong>{props.message}</strong>
    </div>
  );
};

export default Success;
