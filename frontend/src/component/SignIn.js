// src/component/SignIn.js
import React from "react";
import API_URL from "../api";

class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signinEmail:'',
      signinPassword:''
    };
  }

onEmailChange = (event)=>{
  this.setState({signinEmail:event.target.value})
}
onPasswordChange = (event)=>{
  this.setState({signinPassword:event.target.value})
}
onSubmitSignin =()=>{
  fetch(`${API_URL}/signin`,{
    method:'post',
    headers:{'Content-Type' : 'application/json'},
    body:JSON.stringify({
      email:this.state.signinEmail,
      password:this.state.signinPassword
    })
  }).then(respons=>respons.json())
    .then(data=>{
      if(data.id){
        this.props.loadUser(data)
        this.props.onRouteChange('Home')
       }
    })
}

  render(){
    const {onRouteChange} = this.props;
    return (
      <div>
      <div style={{display: "flex",justifyContent: "flex-end",marginLeft:"AUTO",paddingTop:"0px"}} >
        <h3 className='f3 pa3 pointer link dim black underline'> Sign In </h3>
        <h3 onClick={()=>onRouteChange('Register')} className='f3 pa3 pointer link dim black underline'> Register </h3>
      </div>
     <article className="shadow-5 br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center"> 
      <main className="tc pa4 black-80">
        <div className="measure center">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f2 fw6 ph0 mh0">Sign In</legend>

            <div className="mt3">
              <label className="db fw6 lh-copy f5" htmlFor="email-address">
                Email
              </label>
              <input
                onChange = {this.onEmailChange}
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
              />
            </div>

            <div className="mv3">
              <label className="db fw6 lh-copy f5" htmlFor="password">
                Password
              </label>
              <input
                onChange = {this.onPasswordChange}
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </fieldset>

          <div>
            <input
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
              type="submit"
              value="Sign in"
              onClick={this.onSubmitSignin}
            />
          </div>

          <div className="lh-copy mt3">
            <a href="#0" 
              className="f5 link dim black db"
              onClick={()=>onRouteChange('Register')}
            >
              Register
            </a>
          </div>
        </div>
      </main>
    </article>
  </div>
    );   
  }
 
}

export default SignIn;
