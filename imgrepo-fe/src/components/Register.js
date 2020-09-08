import React, { useState } from "react";
import axios from "axios";

export default function Register(props) {
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
        if (res.data.message === "success") {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("expiry", res.data.expiry);
          props.history.push("/dashboard");
        } else if (res.error.errno === 19) {
          alert("That username is already taken");
          setPass("");
          setUsername("");
        } else {
          alert("An error has occurred. Please try again later");
        }
      })
      .catch((err) => console.error(err));
  }
}
