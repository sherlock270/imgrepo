import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="dash-container">
      <h1>Dashboard</h1>
      <Link to="/">Landing</Link>
    </div>
  );
}
