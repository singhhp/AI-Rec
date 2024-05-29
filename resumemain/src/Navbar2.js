import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import WelcomePage from "./Welcome";
import "./App.css";
import logoImage from "../src/assets/logo.png";
import loginImage from "../src/assets/login.png";
import formImage from "../src/assets/form.png";

const Navbar = ({ handleFileUpload, setIsLoading }) => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = () => {
    setIsLoading(true);
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    // Send the file to the backend for processing
    axios
      .post("http://localhost:8000/process/", formData)
      .then((response) => {
        const data = response.data;
        console.log(data); // Ensure that the data is received from Django
        console.log("skillsData:", data.skills);
        // Pass the resume data to the Form component
        handleFileUpload(data);
      })
      .catch((error) => {
        console.error("Error parsing resume:", error);
      });
  };

  return (
    <>
        <div className="welcome-container">
        <div className="logo-container">
          <img className="logo" src={logoImage} alt="Logo" />
        </div>
        <div className="login-container">
          <div className="container">
            {isAuthenticated && (
              <p
                style={{
                  fontSize: "24px",
                  marginTop: "20px",
                  marginLeft: "271px",
                  marginBottom: "33px",
                }}
              >
                Hello, {user.name}
              </p>
            )}
          </div>
          {isAuthenticated ? (
            <button
              className="login-button"
             
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }z
            >
              <img className="loginImage" src={loginImage} alt="" />
              Logout
            </button>
          ) : (
            <WelcomePage loginWithRedirect={loginWithRedirect} />
          )}
        </div>
      </div>
      {isAuthenticated && (
        <div
          className="navbar"
          style={{ display: "flex", alignItems: "center", backgroundColor:"#000", color:"#fff" }}
        >
          <div>Upload Your Resume</div>
          <div
            className="navbarinput"
            style={{
              marginLeft: "10px",
              display: "flex",
              alignItems: "center",
              width: "fit-content",
            }}
          >
            <input type="file" onChange={handleFileChange} />
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              style={{ marginLeft: "10px" }}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
