import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import "./login.css";

export default function Login(props) {
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Login | Dependency Tracker";

    props.logOut();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);
    tempForm[input.name] = input.value;
    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage("Please wait...");
    setShowStatus(true);

    const user = 1;
    // const user = new CognitoUser({
    //   Username: form.email,
    //   Pool: UserPool,
    // });
    // const authenticationDetails = new AuthenticationDetails({
    //   Username: form.email,
    //   Password: form.password,
    // });

    // user.authenticateUser(authenticationDetails, {
    //   onSuccess: (data) => {
    //     window.location.pathname = "/";
    //   },
    //   onFailure: (err) => {
    //     if (err.message.includes("username")) {
    //       setStatusMessage("Invalid email or password.");
    //     } else {
    //       setStatusMessage(err.message);
    //     }

    //     setShowStatus(true);
    //   },
    //   newPasswordRequired: (data) => {
    //     console.log("New password required:", data);
    //   },
    // });
  };

  return (
    <section id="login">
      <h1 className="gold text-center">Login:</h1>
      <form
        id="loginform"
        onSubmit={handleSubmit}
        style={{ marginBottom: "0.75em" }}
      >
        <label className="gold" htmlFor="email">
          Email:
        </label>
        <input
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className="gold" htmlFor="password">
          Password:
        </label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        ></input>
        <div className={showStatus ? "visible-message" : "hidden-message"}>
          <span>{statusMessage}</span>
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
      <div className="text-center mt-3">
        <Link key="register" to="/register">
          <button className="btn btn-primary">Register</button>
        </Link>
      </div>
    </section>
  );
}
