import React, { useEffect, useState } from 'react';
import './WelcomePage.css'; // Import the CSS file for styling
import logoImage from "../src/assets/logo.png";
import loginImage from "../src/assets/login.png";
import welcomeImage from "../src/assets/welcome.jpg";
const WelcomePage = ({ loginWithRedirect }) => {
  
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    setShowText(true);
  }, []);

  return (
   
    <div className="welcome-container"> 
      
     
      <button className='login-button' onClick={() => loginWithRedirect()}>
        
        <img className='loginImage' src={loginImage} alt="" />
        Login
      </button>

      <div className="content">
     
      </div>
      <div className="recommendation-section">
        <p className="recommendation-text">Achieve Your Dream Job</p>
        <p className="recommendation-text">with Our Recommendation System!</p>
        <button className="explore-button">Explore Now</button>
      </div>

    </div>
  );
};

export default WelcomePage;