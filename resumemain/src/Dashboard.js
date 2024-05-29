import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Dashboard.css";
import { useLocation } from "react-router-dom";
import PieChart2 from "./PieChart2";
import Charts from "./Charts";
import axios from 'axios'
import Navbar from "./Navbar";
import logoImage from "../src/assets/logo.png";
import loginImage from "../src/assets/login.png";
import predictedJobRoleData from "./PredictedJR.json"; // Import the predicted job role data
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const predictedJobRole = predictedJobRoleData.PredictedJR || ""; // Get the predicted job role

const Dashboard = ({ loginWithRedirect }) => {
  const { isAuthenticated, user, logout } = useAuth0();
  const location = useLocation();
  const { userDetail, userName, chartsData } = location.state || {};
  console.log("dahs",userName);
  // axios.post('http://127.0.0.1:3001/dashboard')
  // .then(result => {
  //     console.log(result.data[0].skills); // Log the data received from the server
  //     // You can process the data here as needed
  // })
  // .catch(error => {
  //     console.error(error);
  //     // Handle any errors here
  // });

  
  return (
    <>
      
      <div className="dashboard-container">
        
        <div className="charts-container">
        <div id="container">
        <div>
          <div className="logo-container">
          
            <img className="logo" src={logoImage} alt="Logo" />

          </div>
        </div>
        <div>
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
             {isAuthenticated && (
          <button className="login-button" onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }>
            <img className="loginImage" src={loginImage} alt="" />
            Logout
          </button>
          )}
        </div>
      </div>
          <div className="chart-container">
            <center><h3>Analysis</h3></center>
            <hr></hr>
            
            <Charts data={chartsData}  chartType="skills" userNameExist={userName}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
