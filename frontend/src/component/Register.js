import React from "react";
import API_URL from "../api";

class Register extends React.Component{
   constructor(props) {
    super(props);
    this.state = {
     email:'',
     password:'',
     name:'',
     loading: false,
     error: ""
    };
  }

onEmailChange = (event)=>{
  this.setState({email:event.target.value,error: ""})
}
onPasswordChange = (event)=>{
  this.setState({password:event.target.value,error: ""})
}
onNameChange = (event)=>{
  this.setState({name:event.target.value,error: ""})
}
onSubmitRegister =()=>{
  if (this.state.loading) {
      return;
    }
  const { email, password, name } = this.state;
    if (!email || !password || !name) {
      this.setState({
        error: "Please enter your name, email and password."
      });
      return;
    }
    this.setState({
      loading: true,
      error: ""
    });  
  fetch(`${API_URL}/register`,{
    method:'post',
    headers:{'Content-Type' : 'application/json'},
    body:JSON.stringify({
      email:this.state.email,
      password:this.state.password,
      name:this.state.name
    })
  }).then((response) => {
        if (!response.ok) {
          throw new Error("register failed");
        }
        return response.json();
      })
    .then(data=>{
      if(data.id){
        this.props.loadUser(data)
        this.props.onRouteChange('home');
          } else {
          this.setState({
            error: "unable to register.",
            loading: false
          });
        }
    }).catch((error) => {
        console.error("Error register:", error);

        this.setState({
          error: "Email is taken. Please use another email.",
          loading: false
        });
      });
}

render() {
  const { onRouteChange } = this.props;
  const { name, email, password, loading, error } = this.state;

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
        <h3
          onClick={() => onRouteChange("SignIn")}
          className="f3 pa3 pointer link dim black underline"
        >
          Sign In
        </h3>
        <h3 className="f3 pa3 pointer link dim black underline">
          Register
        </h3>
      </div>

      <article className="shadow-5 br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5 center">
        <main className="tc pa4 black-80">
          <div className="measure center">
            <fieldset
              id="sign_up"
              className="ba b--transparent ph0 mh0"
            >
              <legend className="f2 fw6 ph0 mh0">Register</legend>

              {error && (
                <p className="red tc" role="alert">
                  {error}
                </p>
              )}

              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="Name">
                  Name
                </label>
                <input
                  onChange={this.onNameChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="Name"
                  id="Name"
                  value={name}
                  disabled={loading}
                />
              </div>

              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="email-address">
                  Email
                </label>
                <input
                  onChange={this.onEmailChange}
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  value={email}
                  disabled={loading}
                />
              </div>

              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="password">
                  Password
                </label>
                <input
                  onChange={this.onPasswordChange}
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  disabled={loading}
                />
              </div>
            </fieldset>

            <div>
              <button
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
                type="button"
                onClick={this.onSubmitRegister}
                disabled={loading}
                style={{
                  minWidth: "120px",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        </main>
      </article>
    </div>
  );
}

}

export default Register;
