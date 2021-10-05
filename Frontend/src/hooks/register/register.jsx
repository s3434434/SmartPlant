import React, { useEffect, useState } from "react";
import "./register.css";
import _ from "lodash";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    document.title = "Register | Dependency Tracker";
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
    setStatusMessage("Creating account...");
    setShowStatus(true);

    const { email, password } = form;

    // UserPool.signUp(email, password, null, null, (err, data) => {
    //   if (err) {
    //     if (err.message.includes("password")) {
    //       setStatusMessage(
    //         "Password must be at least 8 characters long, and must contain at least one uppercase character, one lowercase character, one number and one symbol."
    //       );
    //     } else {
    //       setStatusMessage(err.message);
    //     }

    //     setShowStatus(true);
    //   } else {
    //     const user = new CognitoUser({
    //       Username: email,
    //       Pool: UserPool,
    //     });
    //     const authenticationDetails = new AuthenticationDetails({
    //       Username: email,
    //       Password: password,
    //     });

    //     user.authenticateUser(authenticationDetails, {
    //       onSuccess: (data) => {
    //         window.location.pathname = "/";
    //       },
    //       onFailure: (err) => {
    //         window.location.pathname = "/";
    //       },
    //     });
    //   }
    // });
  };

  return (
    <section id="register">
      <h1>Register:</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          name="email"
          type="text"
          value={form.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <div className={showStatus ? "visible-message" : "hidden-message"}>
          <span>{statusMessage}</span>
        </div>
        <button className="btn-blue" type="submit">
          Register
        </button>
      </form>
    </section>
  );
}
