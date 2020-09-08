import React from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import ImageDetail from "./components/ImageDetail";

function App() {
  return (
    <div className="app-container">
      <Route path="/" component={Header} />
      <Route exact path="/" component={Landing} />
      <Route
        path="/dashboard"
        render={(props) => {
          if (
            localStorage.getItem("token").length > 1 &&
            Date.now() < localStorage.getItem("expiry")
          ) {
            return <Dashboard {...props} />;
          } else {
            alert("You're not logged in");
            localStorage.setItem("token", "");
            return <Redirect to="/" />;
          }
        }}
      />
      <Route path="/register" render={(props) => <Register {...props} />} />
      <Route path="/login" render={(props) => <Login {...props} />} />
      <Route
        path="/image"
        render={(props) => {
          if (
            localStorage.getItem("token") &&
            Date.now() < localStorage.getItem("expiry")
          ) {
            return <ImageDetail {...props} />;
          } else {
            alert("You're not logged in");
            localStorage.setItem("token", "");
            return <Redirect to="/" />;
          }
        }}
      />
    </div>
  );
}

export default App;
