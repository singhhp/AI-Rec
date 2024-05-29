import React from "react";
import './App.css';
import Form from './Form2';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar2';
import { useAuth0 } from "@auth0/auth0-react";
import Charts from "./Charts";
import {Chart, ArcElement} from 'chart.js'
import Dashboard from "./Dashboard";

Chart.register(ArcElement);


function App() {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  return (
    <>
      <BrowserRouter>
        <Routes>
          {isAuthenticated ? (
            <Route path="/" element={<Form userName={user.name} />} />
          ) : (
            <Route path="/" element={<Navbar />} />
          )}
          <Route path="/charts" element={<Charts />} />
          <Route path="/dashboard" element={<Dashboard/>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
