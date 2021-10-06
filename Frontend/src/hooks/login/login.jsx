import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import "./login.css";

export default function Login(props) {
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "Login | Demeter - The plant meter";

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

    axios
      .post("https://smart-plant.azurewebsites.net/api/Account/Login", form)
      .then((res) => {
        const login = JSON.stringify({
          token: res.data,
          expiry: Date.now() + 3600000,
        });

        localStorage.setItem("demeter-login", login);
        window.location.pathname = "/";
      })
      .catch((err) => {
        setStatusMessage(err.message);
        setShowStatus(true);
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Login</h1>
      <form
        className="w-50 m-auto mt-4"
        onSubmit={handleSubmit}
        style={{ marginBottom: "0.75em" }}
      >
        <label className="form-label gold" htmlFor="email">
          Email
        </label>
        <input
          className="form-control"
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label className="form-label mt-3 gold" htmlFor="password">
          Password
        </label>
        <input
          className="form-control"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        ></input>
        <div className="form-text">
          <span
            id="forgot-password"
            className="gold"
            style={{ textDecoration: "none", cursor: "pointer" }}
            onClick={() => {
              window.location.pathname = "/forgot-password";
            }}
          >
            Forgot password?
          </span>
        </div>

        <div
          className={
            "text-center mt3" + showStatus
              ? "visible-message"
              : "hidden-message"
          }
        >
          <span>{statusMessage}</span>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </section>
  );
}
