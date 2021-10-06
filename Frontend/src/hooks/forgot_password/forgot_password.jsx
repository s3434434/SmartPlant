import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import "./forgot_password.css";

export default function ForgotPassword(props) {
  const [form, setForm] = useState({
    email: "",
    clientURI: "https://demeter.net.au/reset-password",
  });

  useEffect(() => {
    document.title = "Forgot password | Demeter - The plant meter";

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

    axios
      .post("https://smart-plant.azurewebsites.net/api/Password/Forgot", form)
      .then((res) => {
        window.location.pathname = "/request-successful";
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Forgot password</h1>
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
        <div className="form-text">
          <span className="gold" style={{ cursor: "default" }}>
            Enter your email and we will send you a password reset link.
          </span>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary" type="submit">
            Reset password
          </button>
        </div>
      </form>
    </section>
  );
}
