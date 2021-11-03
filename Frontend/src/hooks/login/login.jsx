import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import "./login.css";

export default function Login(props) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

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
    setStatus("Please wait...");
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
        let errorMessage = "Server error. Please try again later.";
        const errors = err.response.data.messages;

        if (errors["Login Details"] !== undefined) {
          errorMessage = errors["Login Details"][0];
        }

        setStatus(errorMessage);
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Login</h1>
      <form
        className="w-25 m-auto mt-4 d-none d-xl-block"
        onSubmit={handleSubmit}
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
            className="gold light-gold-hover"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              window.location.pathname = "/forgot-password";
            }}
          >
            Forgot password?
          </span>
        </div>
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>

      <form className="m-auto mt-4 px-2 d-xl-none" onSubmit={handleSubmit}>
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
            className="gold light-gold-hover"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              window.location.pathname = "/forgot-password";
            }}
          >
            Forgot password?
          </span>
        </div>
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </section>
  );
}
