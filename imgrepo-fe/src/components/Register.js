import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div className="log-reg-container">
      <form className="log-reg-form" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Enter username..."
          onChange={(val) => setUsername(val.target.value)}
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
      .post("https://img-repo.herokuapp.com/register", {
        username: username,
        password: pass,
      })
      .then((res) => {
        console.log("res", res);
        localStorage.setItem("loggedIn", "true");
      })
      .catch((err) => console.error(err));
  }
}
