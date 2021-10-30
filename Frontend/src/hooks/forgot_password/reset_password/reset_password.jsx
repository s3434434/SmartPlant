import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import axios from "axios";
import "./reset_password.css";

export default function ResetPassword(props) {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token"),
    email = new URLSearchParams(search).get("email");

  const [form, setForm] = useState({
    email: email,
    token: token,
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

  useEffect(() => {
    document.title = "Reset password | Demeter - The plant meter";

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
        className="w-25 m-auto mt-4 d-none d-lg-block"
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
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Reset password
          </button>
        </div>
      </form>

      <form className="m-auto mt-4 px-2 d-lg-none" onSubmit={handleSubmit}>
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
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Reset password
          </button>
        </div>
      </form>
    </section>
  );
}
