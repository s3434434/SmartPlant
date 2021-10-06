import React, { useEffect, useState } from "react";
import "./register.css";
import axios from "axios";
import _ from "lodash";

export default function Register(props) {
  const [form, setForm] = useState({
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    clientURI: "https://demeter.net.au/confirm-email",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    document.title = "Register | Demeter - The plant meter";

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
    setStatusMessage("Registering account...");
    setShowStatus(true);

    axios
      .post("https://smart-plant.azurewebsites.net/api/Account/Register", form)
      .then((res) => {
        window.location.pathname = "/registration-successful";
      })
      .catch((err) => {
        setStatusMessage(err.message);
        setShowStatus(true);
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Register</h1>
      <form
        className="w-50 m-auto mt-4"
        style={{ marginBottom: "0.75em" }}
        onSubmit={handleSubmit}
      >
        <div className="container p-0">
          <div className="row">
            <div className="col-sm-6">
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
            </div>
            <div className="col-sm-6">
              <label className="form-label gold" htmlFor="phone">
                Phone
              </label>
              <input
                className="form-control"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-6">
              <label className="form-label gold" htmlFor="firstName">
                First name
              </label>
              <input
                className="form-control"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label gold" htmlFor="lastName">
                Last name
              </label>
              <input
                className="form-control"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-6">
              <label className="form-label gold" htmlFor="password">
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
            </div>
            <div className="col-sm-6">
              <label className="form-label gold" htmlFor="confirmPassword">
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
            </div>
          </div>
        </div>
        <div className={showStatus ? "visible-message" : "hidden-message"}>
          <div className="text-center mt-3">{statusMessage}</div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </div>
      </form>
    </section>
  );
}
