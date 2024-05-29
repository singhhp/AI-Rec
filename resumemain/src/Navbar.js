import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Dashboard.css";
import "./Navbar.css";
import logoImage from "../src/assets/logo.png";
import loginImage from "../src/assets/login.png";

const NavbarM = ({ handleFileUpload }) => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  const handleTakeTest = () => {
    window.location.href = "https://example.com/test";
  };

  return (
    <>



      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        
        <div className="container-fluid">
          {isAuthenticated && (
            <span className="navbar-text me-2">Hello, {user.name}</span>
          )}

          <button className="btn btn-primary me-2" onClick={handleTakeTest}>
            Take a Test
          </button>

          {isAuthenticated ? (
            <button
              className="btn btn-success"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              
              Log Out
            </button>
          ) : (
            <button className="btn btn-success" onClick={() => loginWithRedirect()}>
              Log In
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarM;
