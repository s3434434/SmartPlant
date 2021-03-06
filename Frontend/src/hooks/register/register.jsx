import React, { useEffect, useState } from "react";
import "./register.css";
import axios from "axios";
import _ from "lodash";

export default function Register(props) {
  const { logOut, wideView } = props;

  // State variables for the registration form, status of the registration request and whether that status is being shown.
  const [form, setForm] = useState({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately and ensures the user is logged out on the UI.
  useEffect(() => {
    document.title = "Register | Demeter - The plant meter";

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

  // Handles the submit event of the registration form. Sets the request status appropriately, then performs a check on whether the form's 'password' and 'confirmPassword' fields match. If not, an appropriate error message is shown.
  // Otherwise, a POST request to the backend registration endpoint is made with the form data and the clientURI for the confirmation email to be sent by the backend. If this request is successful, the user is taken to the 'Registration successful' page. Otherwise, an appropriate error message is shown.
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Registering account...");
    setShowStatus(true);

    if (form.password !== form.confirmPassword) {
      setStatus("Passwords do not match.");
    } else {
      const registrationData = _.cloneDeep(form);
      registrationData.clientURI = "https://www.demeter.onl/confirm-email";

      axios
        .post(
          "https://smart-plant.azurewebsites.net/api/Account/Register",
          registrationData
        )
        .then((res) => {
          window.location.pathname = "/registration-successful";
        })
        .catch((err) => {
          const errors = err.response.data.errors;
          let errorMessage = "Server error. Please try again later.";

          if (errors.Email !== undefined) {
            errorMessage = errors.Email[0];
          } else if (errors.PhoneNumber !== undefined) {
            errorMessage = errors.PhoneNumber[0];
          } else if (errors.FirstName !== undefined) {
            errorMessage = errors.FirstName[0];
          } else if (errors.LastName !== undefined) {
            errorMessage = errors.LastName[0];
          } else if (errors.Passwords !== undefined) {
            errorMessage = errors.Passwords[0];
          } else if (errors.ConfirmPassword !== undefined) {
            errorMessage = errors.ConfirmPassword[0];
          }

          setStatus(errorMessage);
        });
    }
  };

  return (
    <section>
      <h1 className="gold text-center">Register</h1>
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
          required
          value={form.email}
          onChange={handleChange}
        />
        <label className="form-label gold mt-3" htmlFor="phoneNumber">
          Phone
        </label>
        <input
          className="form-control"
          name="phoneNumber"
          type="text"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <label className="form-label gold mt-3" htmlFor="firstName">
          First name
        </label>
        <input
          className="form-control"
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={handleChange}
        />
        <label className="form-label gold mt-3" htmlFor="lastName">
          Last name
        </label>
        <input
          className="form-control"
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
        />
        <label className="form-label gold mt-3" htmlFor="password">
          Password
        </label>
        <input
          className="form-control"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
        />
        <label className="form-label gold mt-3" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          className="form-control"
          name="confirmPassword"
          type="password"
          required
          value={form.confirmPassword}
          onChange={handleChange}
        />
        <div
          className="form-text mt-2"
          style={{ color: "white", textAlign: "justify" }}
        >
          By clicking Register you agree to our&nbsp;
          <span
            className="gold light-gold-hover"
            tabIndex="0"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              window.location.pathname = "/terms-of-use";
            }}
            onKeyPress={() => {
              window.location.pathname = "/terms-of-use";
            }}
          >
            terms of use
          </span>
          . For more information about our privacy practices, please see
          our&nbsp;
          <span
            className="gold light-gold-hover"
            tabIndex="0"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => {
              window.location.pathname = "/privacy-policy";
            }}
            onKeyPress={() => {
              window.location.pathname = "/privacy-policy";
            }}
          >
            privacy policy
          </span>
          .
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
            Register
          </button>
        </div>
      </form>
    </section>
  );
}
