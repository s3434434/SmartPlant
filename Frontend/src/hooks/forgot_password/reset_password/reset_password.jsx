import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import "./reset_password.css";

export default function ResetPassword(props) {
  const { logOut, wideView } = props;
  const search = useLocation().search;
  // Sets constants for the 'token' and 'email' URL parameters.
  const token = new URLSearchParams(search).get("token"),
    email = new URLSearchParams(search).get("email");

  // State variables for the password reset form, status of the password reset request and whether that status is being shown.
  const [form, setForm] = useState({
    email: email,
    token: token,
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately and ensures the user is logged out on the UI.
  useEffect(() => {
    document.title = "Reset password | Demeter - The plant meter";

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

  // Handles the submit event of the password reset form. Sets the request status appropriately, then performs a check on whether the form's 'newPassword' and 'confirmNewPassword' fields match. If not, an appropriate error message is shown.
  // Otherwise, a POST request to the backend password reset endpoint is made. If this request is successful, the user is taken to the 'Password reset successful' page. Otherwise, an appropriate error message is shown.
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    if (form.newPassword !== form.confirmNewPassword) {
      setStatus("Passwords do not match.");
    } else {
      axios
        .post(
          "https://smart-plant.azurewebsites.net/api/Account/Password/Reset",
          form
        )
        .then((res) => {
          window.location.pathname = "/password-reset-successful";
        })
        .catch((err) => {
          const errors = err.response.data.messages;
          let errorMessage = "Server error. Please try again later.";

          if (errors.Passwords !== undefined) {
            errorMessage = errors.Passwords[0];
          } else if (errors.ConfirmNewPassword !== undefined) {
            errorMessage = errors.ConfirmNewPassword[0];
          }

          setStatus(errorMessage);
        });
    }
  };

  return (
    <section>
      <h1 className="gold text-center">Reset password</h1>
      <form
        className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
        onSubmit={handleSubmit}
      >
        <label className="form-label gold" htmlFor="newPassword">
          New password
        </label>
        <input
          className="form-control"
          name="newPassword"
          type="password"
          required
          value={form.newPassword}
          onChange={handleChange}
        />
        <label className="form-label gold mt-3" htmlFor="confirmNewPassword">
          Confirm new password
        </label>
        <input
          className="form-control"
          name="confirmNewPassword"
          type="password"
          value={form.confirmNewPassword}
          onChange={handleChange}
        />
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
