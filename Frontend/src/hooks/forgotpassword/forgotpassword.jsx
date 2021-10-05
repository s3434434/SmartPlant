import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import "./forgotpassword.css";

export default function ForgotPassword(props) {
  const [email, setForm] = useState("");

  useEffect(() => {
    document.title = "Forgot password | Demeter - The plant meter";

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
      .post("https://smart-plant.azurewebsites.net/api/Password/Forgot", email)
      .then((res) => {
        localStorage.setItem("demeter-user", res.body);
        window.location.pathname = "/";
      })
      .catch((err) => {
        setStatusMessage(err.message);
        setShowStatus(true);
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
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Reset password
          </button>
        </div>
      </form>
    </section>
  );
}
