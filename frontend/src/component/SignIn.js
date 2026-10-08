// src/component/SignIn.js
import React from "react";
import API_URL from "../api";

class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signinEmail:'',
      signinPassword:'',
      loading: false,
      error: ""
    };
  }

onEmailChange = (event)=>{
  this.setState({
    signinEmail:event.target.value,
    error: ""
  })
}
onPasswordChange = (event)=>{
  this.setState({
    signinPassword:event.target.value,
    error: ""
  })
}
onSubmitSignin =()=>{
  if (this.state.loading) {
      return;
    }
  const { signinEmail, signinPassword } = this.state;
    if (!signinEmail || !signinPassword) {
      this.setState({
        error: "Please enter your email and password."
      });
      return;
    }
 this.setState({
      loading: true,
      error: ""
    });

  fetch(`${API_URL}/signin`,{
    method:'post',
    headers:{'Content-Type' : 'application/json'},
    body:JSON.stringify({
      email:signinEmail,
      password:signinPassword
    })
  }).then((response) => {
        if (!response.ok) {
          throw new Error("Sign in failed");
        }
        return response.json();
      })
    .then(data=>{
      if(data.id){
        this.props.loadUser(data)
        this.props.onRouteChange('home')
       }else {
          this.setState({
            error: "Incorrect email or password.",
            loading: false
          });
        }
    }).catch((error) => {
        console.error("Error signing in:", error);

        this.setState({
          error: "Unable to sign in. Please try again.",
          loading: false
        });
      });
  };

  render() {
  const { onRouteChange } = this.props;
  const { signinEmail, signinPassword, loading, error } = this.state;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginLeft: "auto",
          paddingTop: "0px"
        }}
      >
        <h3 className="f3 pa3 pointer link dim black underline">
          Sign In
        </h3>
        <h3
          onClick={() => onRouteChange("Register")}
          className="f3 pa3 pointer link dim black underline"
        >
          Register
        </h3>
      </div>

      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset
              id="sign_up"
              className="ba b--transparent ph0 mh0"
            >
              <legend className="f2 fw6 ph0 mh0">Sign In</legend>

              {error && (
                <p className="red tc" role="alert">
                  {error}
                </p>
              )}

              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email"
                  id="email"
                  value={signinEmail}
                  onChange={this.onEmailChange}
                  disabled={loading}
                />
              </div>

              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  value={signinPassword}
                  onChange={this.onPasswordChange}
                  disabled={loading}
                />
              </div>
            </fieldset>

            <div>
              <button
                type="button"
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                onClick={this.onSubmitSignin}
                disabled={loading}
                style={{
                  minWidth: "120px",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            <div className="lh-copy mt3">
              <button
                type="button"
                className="f6 link dim black db pointer bg-transparent bn"
                onClick={() => onRouteChange("Register")}
                disabled={loading}
              >
                Register
              </button>
            </div>
          </div>
        </main>
      </article>
    </div>
  );
}

 
}

export default SignIn;
