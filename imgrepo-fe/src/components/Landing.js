import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing-container">
      <h1>Landing Page</h1>
      <Link to="/dashboard">dashboard</Link>
    </div>
  );
}
