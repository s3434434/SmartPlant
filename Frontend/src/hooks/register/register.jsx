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
    clientURI: "http://localhost:3000/confirm-email",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

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
    setStatus("Registering account...");
    setShowStatus(true);

    if (form.password !== form.confirmPassword) {
      setStatus("Passwords do not match.");
    } else {
      axios
        .post(
          "https://smart-plant.azurewebsites.net/api/Account/Register",
          form
        )
        .then((res) => {
          window.location.pathname = "/registration-successful";
        })
        .catch((err) => {
          const data = err.response.data;
          let errorMessage = "";

          if (data.error !== undefined) {
            errorMessage = data.error[0];
          } else {
            const errors = data.errors;
            if (errors instanceof Array) {
              errorMessage = errors[0];
            } else {
              Object.keys(errors).forEach((error) => {
                if (errors[error] !== undefined) {
                  errorMessage = errors[error];
                }
              });
            }
          }

          setStatus(errorMessage);
        });
    }
  };

  return (
    <section>
      <h1 className="gold text-center">Register</h1>
      <form
        className="w-25 m-auto mt-4 d-none d-lg-block"
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
        <div className={showStatus || "hidden-field"}>
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </div>
      </form>

      <form className="m-auto mt-4 d-lg-none px-2" onSubmit={handleSubmit}>
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
        <div className={showStatus || "hidden-field"}>
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
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
