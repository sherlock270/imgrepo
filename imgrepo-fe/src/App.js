import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
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
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/image" component={ImageDetail} />
    </div>
  );
}

export default App;
