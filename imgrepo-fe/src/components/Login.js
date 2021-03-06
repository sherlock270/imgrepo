import React, { useState } from "react";
import axios from "axios";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="log-reg-container">
      <form className="log-reg-form" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Enter username..."
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="password"
          placeholder="Enter password..."
          onChange={(e) => setPass(e.target.value)}
          value={pass}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post("https://img-repo.herokuapp.com/login", {
        username: username,
        password: pass,
      })
      .then((res) => {
        if (res.data.message === "success") {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("expiry", res.data.expiry);
          props.history.push("/dashboard");
        } else {
          alert("Incorrect username or password");
        }
      });
  }
}
