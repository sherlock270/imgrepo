import React from "react";
import "./App.css";
import { Route, Redirect } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import ImageDetail from "./components/ImageDetail";
import axios from "axios";

function App() {
  return (
    <div className="app-container">
      <Route path="/" component={Header} />
      <Route exact path="/" component={Landing} />
      <Route
        path="/dashboard"
        render={() => {
          if (isLoggedIn()) {
            return <Dashboard />;
          } else {
            alert("You're not logged in");
            localStorage.setItem("token", "");
            return <Redirect to="/" />;
          }
        }}
      />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route
        path="/image"
        render={() => {
          if (isLoggedIn()) {
            return <ImageDetail />;
          } else {
            localStorage.setItem("token", "");
            alert("You're not logged in");
            return <Redirect to="/" />;
          }
        }}
      />
    </div>
  );
}

function isLoggedIn() {
  const token = localStorage.getItem("token");
  if (token && token.length > 8) {
    axios.post("https://img-repo.herokuapp.com/verify", token).then((res) => {
      return res.loggedIn;
    });
  } else {
    return false;
  }
}

export default App;
