import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Landing from "./components/Landing";
import Header from "./components/Header";

function App() {
  return (
    <div className="app-container">
      <Route path="/" component={Header} />
      <Route exact path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
    </div>
  );
}

export default App;
