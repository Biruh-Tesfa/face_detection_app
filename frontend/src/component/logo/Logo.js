import React from "react";
import Tilt from "./Tilt";
import Log from "./brain.png"; // replace with your logo path

function Logo() {
  return (
    <Tilt options={{ max: 20, speed:9100, glare: true, "max-glare": 0.2 }}>
      <div style={{ padding: "0px" }}>
        <img 
          className="shadow-2"
          src={Log} alt="log" 
          style={{background:"linear-gradient(to right, #FF5EDF 0%, #04C8DE 100%)", width: "100px", height: "100px",borderRadius:"7px",padding:"20px",marginLeft:"30px"}} />
      </div>
    </Tilt>
  );
}

export default Logo;
