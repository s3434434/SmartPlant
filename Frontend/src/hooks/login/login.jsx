import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import "./login.css";

export default function Login(props) {
  const { logOut, wideView } = props;

  // State variables for the login form, status of the login request and whether that status is being shown.
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately.
  useEffect(() => {
    document.title = "Login | Demeter - The plant meter";

    logOut();
    // eslint-disable-next-line
  }, []);

  // Updates the form state variable with the appropriate input field whenever a form input field is updated.
  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);
    tempForm[input.name] = input.value;
    setForm(tempForm);
  };

  // Handles the submit event of the login form. Sets the request status appropriately, then performs a POST request to the backend login endpoint. If this request is unsuccessful, an appropriate error message is shown.
  // Otherwise, a second GET request is sent to the backend endpoint responsible for the user's role. If this request is successful, the login data(the JWT, JWT expiry of the current time plus 1 hour, and whether the user is an admin) is added to localStorage and the user is redirected to the root path. Otherwise, an appropriate error message is shown.
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    axios
      .post("https://smart-plant.azurewebsites.net/api/Account/Login", form)
      .then((res) => {
        const token = res.data;
        axios
          .get("https://smart-plant.azurewebsites.net/api/User/Role", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const login = JSON.stringify({
              token: token,
              expiry: Date.now() + 3600000,
              admin: res.data === "Admin",
            });

            localStorage.setItem("demeter-login", login);
            window.location.pathname = "/";
          })
          .catch((err) => {
            setStatus("Server error. Please try again later.");
          });
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
        className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
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
        <div className="form-text mt-2">
          <span
            className="gold light-gold-hover"
            tabIndex="0"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              window.location.pathname = "/forgot-password";
            }}
            onKeyPress={() => {
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
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
        >
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </div>
      </form>
    </section>
  );
}
