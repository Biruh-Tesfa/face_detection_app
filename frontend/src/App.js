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
      imageUrlError: "",
      detecting: "detect",
      user:{
        id:"",
        name:"",
        email:"",
        entrie:0,
        joined:"",
      }
    };
  }
componentDidMount() {
  const savedUser = this.getUserFromStorage();

  if (savedUser) {
    this.setState({
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        entrie: savedUser.entrie,
        joined: savedUser.joined
      },
      route: "home"
    });
  }
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
      triggerDetect: false,
      imageUrlError: "",
      detecting: "detect" 
    });
  };
  onKeyDown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    this.onButtonSubmit();
  }
};
  onButtonSubmit = () => {
  if (this.state.detecting !== "detect") {
    return;
  }
    const rawUrl = this.state.input.trim();

    try { 
     const parsedUrl = new URL(rawUrl);
     if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Unsupported protocol");
    }

      this.setState({ 
       imageURL: "",
       triggerDetect: false,
       imageUrlError: "",
       detecting: "detecting",      // start “loading”
       imageDisplayed: false // reset until image is shown 
     });
      this.validateImageURL(parsedUrl.href);
    } catch {
      this.setState({
      imageURL: "",
      triggerDetect: false,
      imageDisplayed: false,
      imageUrlError: "Please enter a valid image URL.",
      detecting: "detect"
    });
    }
  }
 onRouteChange = (event) => {
  if (event === "SignIn") {
    this.removeUserFromStorage();
    this.setState({
      input: '',
      imageURL: '',
      triggerDetect: false,
      imageDisplayed: false,
      imageUrlError: '',
      detecting: "detect",
      route: 'SignIn',
      user: {
        id: "",
        name: "",
        email: "",
        entrie: 0,
        joined: "",
      }
    });
  } else {
    this.setState({ route: event });
  }
}

saveUserToStorage = (user) => {
  localStorage.setItem("faceUser", JSON.stringify(user));
};
getUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem("faceUser");

    if (!savedUser) return null;

    const parsedUser = JSON.parse(savedUser);

    // Basic validation
    if (parsedUser && parsedUser.id) {
      return parsedUser;
    }

    return null;
  } catch (error) {
    console.error("Error reading saved user:", error);
    localStorage.removeItem("faceUser");
    return null;
  }
};
removeUserFromStorage = () => {
  localStorage.removeItem("faceUser");
};

  loadUser =(data)=>{
   const user = {
        id:data.id,
        name:data.name,
        email:data.email,
        entrie:data.entrie,
        joined:data.joined,
      }
    this.setState({user});
    this.saveUserToStorage(user);
  }
setDetectionStatus = (status) => {
  this.setState({ detecting: status });
};
setImageDisplayed = (value) => {
  this.setState({ imageDisplayed: value });

  if (!value || !this.state.triggerDetect) {
    return;
  }

  fetch(`${API_URL}/image`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: this.state.user.id
    })
  })
    .then((response) => {
       if (!response.ok) {
        throw new Error("Failed to update entry count");
    }
    return response.json();
  })
    .then((count) => {
      this.setState((prevState) => {
       const updatedUser = {
          ...prevState.user,
          entrie: count
        };
         this.saveUserToStorage(updatedUser);
         return { user: updatedUser };
      });
    })
    .catch((error) => {
      console.error("Error updating entries:", error);
    });
};
setDetectionError = (message) => {
  this.setState({
    detecting: "detect",
    triggerDetect: false,
    imageURL: "",
    imageDisplayed: false,
    imageUrlError: message
  });
};
validateImageURL = (url) => {
  const image = new Image();

  image.onload = () => {
    this.setState({
      imageURL: url,
      triggerDetect: true,
      imageUrlError: "",
      detecting: "detecting",
      imageDisplayed: false
    });
  };

  image.onerror = () => {
    this.setState({
      imageURL: "",
      triggerDetect: false,
      imageUrlError: "Could not load this image. Please check the URL and try again.",
      detecting: "detect"
    });
  };

  image.src = url;
};

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
                  onKeyDown={this.onKeyDown}
                  imageUrlError={this.state.imageUrlError}
                  detecting={this.state.detecting}
                />
                <Photo 
                 setDetectionError={this.setDetectionError}
                 setDetectionStatus={this.setDetectionStatus} 
                 setImageDisplayed={this.setImageDisplayed} 
                 imageURL={this.state.imageURL} 
                 triggerDetect={this.state.triggerDetect}
                />
             </div>
            )   
        }
     </div> 
    
    );
  }
}

export default App;