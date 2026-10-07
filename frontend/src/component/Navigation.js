import React from 'react';

function Navigation({onRouteChange}) {
  return (
    <div style={{display: "flex",justifyContent: "flex-end",marginLeft:"AUTO",paddingTop:"0px"}} >
      <h3 onClick={()=>onRouteChange('SignIn')} className='f3 pa3 pointer link dim black underline'> Sign Out </h3>
    </div>
  );
}

export default Navigation;