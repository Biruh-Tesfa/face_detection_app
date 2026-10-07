import React from "react";

function Rank({name,entrie}) {
  return (
    <div className="tc f4 ">
      <h5 className="mb1 f3 mt1">{`${name}, your current entry count is...`}</h5>
      <h4 className="mt1 mb1 f2">{entrie}</h4>
    </div>  
  );
}

export default Rank;
