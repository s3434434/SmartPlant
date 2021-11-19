import React, { useState, useEffect } from "react";
import axios from "axios";
import "./forgot_password.css";

export default function ForgotPassword(props) {
  const { logOut, wideView } = props;

  // State variables for the forgot password email, status of the forgot password request and whether that status is being shown.
  const [email, setEmail] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately and ensures the user is logged out on the UI.
  useEffect(() => {
    document.title = "Forgot password | Demeter - The plant meter";
    logOut();

    // eslint-disable-next-line
  }, []);

  // Updates the email state variable with the email input field whenever it is updated.
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Handles the submit event of the forgot password form. Sets the request status appropriately, then sends a POST request to the backend reset password endpoint with the email state variable and the clientURI for the password reset email to be sent by the backend. Regardless of success or failure, once the request completes the user is taken to the 'Request processed' page.
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    axios
      .post(
        "https://smart-plant.azurewebsites.net/api/Account/Password/Forgot",
        { email: email, clientURI: "https://www.demeter.onl/reset-password" }
      )
      .then((res) => {
        window.location.pathname = "/request-processed";
      })
      .catch((err) => {
        window.location.pathname = "/request-processed";
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Forgot password</h1>
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
          value={email}
          onChange={handleChange}
          required
        />
        <div className="form-text mt-2">
          <span style={{ color: "white" }}>
            Enter your email and we will send you a password reset link.
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
            Reset password
          </button>
        </div>
      </form>
    </section>
  );
}
