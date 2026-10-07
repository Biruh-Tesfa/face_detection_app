import React, { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

function Tilt({ options, children }) {
  const tiltRef = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tiltRef.current, options || {
      max: 25,
      speed: 400,
      glare: true,
      "max-glare": 0.5,
    });
  }, [options]);

  return (
    <div ref={tiltRef} 
      style={{ height: "150px", width: "150px",marginTop:"15px"}}>
      {children}
    </div>
  );
}

export default Tilt;
