import React from 'react';
import './App.css';
import Navigation from './component/Navigation';
import Logo from './component/logo/Logo.js';
import ImageLinkForm from './component/ImageLinkForm';
import Rank from './component/Rank';
import Photo from './component/Photo';
import SignIn from './component/SignIn.js';
import Register from './component/Register.js';
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import API_URL from "./api";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      triggerDetect: false,
      imageDisplayed:false,
      route:'SignIn',
      user:{
        id:"",
        name:"",
        email:"",
        entrie:0,
        joined:"",
      }
    };
  }

  particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  particlesLoaded = async (container) => {
    console.log(container);
  };

  option1 = {
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 170, enable: true, opacity: 0.5, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, speed: 1 },
      number: { density: { enable: true, area: 500 }, value: 80 },
      opacity: { value: 0.2 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
  };
  onInputChange = (event) => {
    this.setState({ 
      input: event.target.value,
      triggerDetect: false 
    });
  };
  onButtonSubmit = () => {
    try {
      new URL(this.state.input);
      this.setState({ imageURL: this.state.input, triggerDetect: true });
    } catch {
      alert("Please enter a valid image URL.");
    }
  }
  onRouteChange = (event)=>{
    this.setState({route:event})
  }
  loadUser =(data)=>{
    this.setState({ user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entrie:data.entrie,
        joined:data.joined,
      }
    })
  }
setImageDisplayed = (value) => {
  this.setState({ imageDisplayed: value });
        fetch(`${API_URL}/image`,{
        method:'put',
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
          id:this.state.user.id
        })
  }).then(respons=>respons.json())
    .then(count=>{
      if(this.state.imageDisplayed){
     this.setState( Object.assign(this.state.user,{entrie:count}))
   }
  });
}

 render() {
   return (
    <div>
          <Particles
            className="particles"
            id="tsparticles"
            init={this.particlesInit}
            loaded={this.particlesLoaded}
            options={this.option1}
          />
        {
           this.state.route==='SignIn'   
            ?<SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
            :(
              this.state.route==='Register'
              ?<Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
              :<div>
                <div className="header">
                  <Logo />
                  <Navigation onRouteChange={this.onRouteChange} />
                </div>
                <Rank name ={this.state.user.name} entrie ={this.state.user.entrie}/> 
                <ImageLinkForm
                  onInputeChange={this.onInputChange}
                  onbuttonclick={this.onButtonSubmit}
                />
                <Photo setImageDisplayed={this.setImageDisplayed} imageURL={this.state.imageURL} triggerDetect={this.state.triggerDetect} />
             </div>
            )   
        }
     </div> 
    
    );
  }
}

export default App;