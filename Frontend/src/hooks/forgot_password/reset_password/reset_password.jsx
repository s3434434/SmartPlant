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
  const [statusMessage, setStatusMessage] = useState("");

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
    setStatusMessage("Please wait...");
    setShowStatus(true);

    axios
      .post(
        "https://smart-plant.azurewebsites.net/api/Account/Password/Reset",
        form
      )
      .then((res) => {
        window.location.pathname = "/password-reset-successful";
      })
      .catch((err) => {
        setStatusMessage(err.message);
        setShowStatus(true);
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Reset password</h1>
      <form
        className="w-50 m-auto mt-4"
        style={{ marginBottom: "0.75em" }}
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
        <div className={showStatus ? "visible-message" : "hidden-message"}>
          <div className="text-center mt-3">{statusMessage}</div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Reset password
          </button>
        </div>
      </form>
    </section>
  );
}
