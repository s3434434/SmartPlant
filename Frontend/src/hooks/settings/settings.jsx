import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import "./settings.css";

export default function Settings(props) {
  const [emailForm, setEmailForm] = useState({
      email: "",
      confirmEmail: "",
    }),
    [detailsForm, setDetailsForm] = useState({
      phoneNumber: "",
      firstName: "",
      lastName: "",
    }),
    [passwordform, setPasswordForm] = useState({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    }),
    [emailModifiable, setEmailModifiable] = useState(false),
    [detailsModifiable, setDetailsModifiable] = useState(false),
    [phoneNumberModifiable, setPhoneNumberModifiable] = useState(false),
    [firstNameModifiable, setFirstNameModifiable] = useState(false),
    [lastNameModifiable, setLastNameModifiable] = useState(false),
    [passwordModifiable, setPasswordModifiable] = useState(false),
    [showEmailStatus, setShowEmailStatus] = useState(false),
    [emailStatus, setEmailStatus] = useState(""),
    [showDetailsStatus, setShowDetailsStatus] = useState(false),
    [detailsStatus, setDetailsStatus] = useState(""),
    [showPasswordStatus, setShowPasswordStatus] = useState(false),
    [passwordStatus, setPasswordStatus] = useState("");

  useEffect(() => {
    document.title = "Settings | Demeter - The plant meter";

    const login = localStorage.getItem("demeter-login");
    const { token } = JSON.parse(login);
    axios
      .get("https://smart-plant.azurewebsites.net/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const settings = res.data;

        setEmailForm({ email: settings.email, confirmEmail: "" });
        setDetailsForm({
          phoneNumber: settings.phoneNumber,
          firstName: settings.firstName,
          lastName: settings.lastName,
        });
      })
      .catch((err) => {
        props.logOut();
        window.location.pathname = "/";
      });
    // eslint-disable-next-line
  }, []);

  const handleEmailChange = (e) => {
    const input = e.target;
    const tempEmailForm = _.cloneDeep(emailForm);

    tempEmailForm[input.name] = input.value;

    setEmailForm(tempEmailForm);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailStatus("Please wait...");
    setShowEmailStatus(true);

    const login = localStorage.getItem("demeter-login");
    const { token } = JSON.parse(login);

    axios
      .put("https://smart-plant.azurewebsites.net/api/User/Email", emailForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setEmailStatus(err.response.data);
      });
  };

  const handleDetailsChange = (e) => {
    const input = e.target;
    const tempDetailsForm = _.cloneDeep(detailsForm);

    tempDetailsForm[input.name] = input.value;

    setDetailsForm(tempDetailsForm);
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setDetailsStatus("Please wait...");
    setShowDetailsStatus(true);

    const login = localStorage.getItem("demeter-login");
    const { token } = JSON.parse(login);

    axios
      .put("https://smart-plant.azurewebsites.net/api/User", detailsForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setDetailsStatus(err.response.data);
      });
  };

  // const handleAccountChange = (e) => {
  //   const input = e.target;
  //   const tempAccount = _.cloneDeep(account);

  //   if (input.type === "checkbox") {
  //     tempAccount["preferences"][input.name] = input.checked;
  //   } else {
  //     tempAccount[input.name] = input.value;
  //   }

  //   setAccount(tempAccount);
  // };

  // const handleAccountSubmit = (e) => {
  //   e.preventDefault();

  //   const { major, minor, patch } = account.preferences;

  //   getCurrentUser()
  //     .then((user) => {
  //       user.getSession((err, session) => {
  //         if (!err) {
  //           if (
  //             major !== initialPreferences["major"] ||
  //             minor !== initialPreferences["minor"] ||
  //             patch !== initialPreferences["patch"]
  //           ) {
  //             setAccountStatusMessage("Please wait...");
  //             setShowAccountStatus(true);

  //             const updatePreferences = async () => {
  //               let body = account.preferences;
  //               body["email"] = account.email;

  //               await fetch(
  //                 "https://43wwya78h8.execute-api.us-east-2.amazonaws.com/prod/preferences",
  //                 {
  //                   method: "post",
  //                   body: JSON.stringify(body),
  //                   headers: {
  //                     Authorization: session.getIdToken().getJwtToken(),
  //                   },
  //                 }
  //               );

  //               window.location.reload();
  //             };
  //             updatePreferences();
  //           }
  //         }
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const handlePasswordChange = (e) => {
  //   const input = e.target;
  //   const tempPasswords = _.cloneDeep(passwords);

  //   tempPasswords[input.name] = input.value;
  //   setPasswords(tempPasswords);
  // };

  // const handlePasswordSubmit = (e) => {
  //   e.preventDefault();
  //   setPasswordStatusMessage("Please wait...");
  //   setShowPasswordStatus(true);

  //   if (passwords.newPassword !== passwords.confirmNewPassword) {
  //     setPasswordStatusMessage("Passwords do not match.");
  //   } else {
  //     getCurrentUser()
  //       .then((user) => {
  //         user.getSession((err, session) => {
  //           if (!err) {
  //             user.changePassword(
  //               passwords.oldPassword,
  //               passwords.newPassword,
  //               (err, result) => {
  //                 if (err) {
  //                   if (err.message.includes("username")) {
  //                     setPasswordStatusMessage("Old password was incorrect.");
  //                   } else {
  //                     setPasswordStatusMessage(err.message);
  //                   }
  //                 } else {
  //                   window.location.reload();
  //                 }
  //               }
  //             );
  //           }
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <section>
      <h1 className="text-center gold">Settings</h1>

      <form
        className="w-50 m-auto mt-4"
        style={{ marginBottom: "0.75em" }}
        onSubmit={handleEmailSubmit}
      >
        <div className="container">
          <div className="row">
            {emailModifiable ? (
              <>
                <div className="col-lg-6">
                  <label className="form-label gold" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-control"
                    name="email"
                    type="text"
                    required
                    value={emailForm.email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label gold" htmlFor="confirmEmail">
                    Confirm email
                  </label>
                  <input
                    className="form-control"
                    name="confirmEmail"
                    type="text"
                    required
                    value={emailForm.confirmEmail}
                    onChange={handleEmailChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="col-lg-6">
                  <div className="container p-0">
                    <div className="row">
                      <div className="col-sm-10">
                        <span className="gold">Email</span>
                      </div>
                      <div className="col-sm-2 text-end">
                        <FontAwesomeIcon
                          className="gold light-gold-hover"
                          icon={faPen}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setEmailModifiable(true);
                          }}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 py-1 overflow-hidden setting">
                    <span className="ms-1">{emailForm.email}</span>
                  </div>
                </div>
                <div className="col-lg-6"></div>
              </>
            )}
          </div>
        </div>
        {emailModifiable && (
          <div className="text-center mt-3">
            <button className="btn btn-primary" type="submit">
              Apply change
            </button>
          </div>
        )}
      </form>

      <form
        className="w-50 m-auto mt-4"
        style={{ marginBottom: "0.75em" }}
        onSubmit={handleDetailsSubmit}
      >
        <div className="container">
          <div className="row">
            {phoneNumberModifiable ? (
              <div className="col-lg-6">
                <label className="form-label gold" htmlFor="phoneNumber">
                  Phone
                </label>
                <input
                  className="form-control"
                  name="phoneNumber"
                  type="text"
                  value={detailsForm.phoneNumber}
                  onChange={handleDetailsChange}
                />
              </div>
            ) : (
              <div className="col-lg-6">
                <div className="container p-0">
                  <div className="row">
                    <div className="col-sm-10">
                      <span className="gold">Phone</span>
                    </div>
                    <div className="col-sm-2 text-end">
                      <FontAwesomeIcon
                        className="gold light-gold-hover"
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setPhoneNumberModifiable(true);
                          setDetailsModifiable(true);
                        }}
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
                <div className="mt-1 py-1 overflow-hidden setting">
                  <span className="ms-1">{detailsForm.phoneNumber}</span>
                </div>
              </div>
            )}

            {firstNameModifiable ? (
              <div className="col-lg-6">
                <label className="form-label gold" htmlFor="firstName">
                  First name
                </label>
                <input
                  className="form-control"
                  name="firstName"
                  type="text"
                  value={detailsForm.firstName}
                  onChange={handleDetailsChange}
                />
              </div>
            ) : (
              <div className="col-lg-6">
                <div className="container p-0">
                  <div className="row">
                    <div className="col-sm-10">
                      <span className="gold">First name</span>
                    </div>
                    <div className="col-sm-2 text-end">
                      <FontAwesomeIcon
                        className="gold light-gold-hover"
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setFirstNameModifiable(true);
                          setDetailsModifiable(true);
                        }}
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
                <div className="mt-1 py-1 overflow-hidden setting">
                  <span className="ms-1">{detailsForm.firstName}</span>
                </div>
              </div>
            )}
          </div>
          <div className="row mt-2">
            {lastNameModifiable ? (
              <div className="col-lg-6">
                <label className="form-label gold" htmlFor="lastName">
                  Last name
                </label>
                <input
                  className="form-control"
                  name="lastName"
                  type="text"
                  value={detailsForm.lastName}
                  onChange={handleDetailsChange}
                />
              </div>
            ) : (
              <div className="col-lg-6">
                <div className="container p-0">
                  <div className="row">
                    <div className="col-sm-10">
                      <span className="gold">Last name</span>
                    </div>
                    <div className="col-sm-2 text-end">
                      <FontAwesomeIcon
                        className="gold light-gold-hover"
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setLastNameModifiable(true);
                          setDetailsModifiable(true);
                        }}
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
                <div className="mt-1 py-1 overflow-hidden setting">
                  <span className="ms-1">{detailsForm.lastName}</span>
                </div>
              </div>
            )}
            <div className="col-lg-6"></div>
          </div>
        </div>
        {detailsModifiable && (
          <div className="text-center mt-3">
            <button className="btn btn-primary" type="submit">
              Apply changes
            </button>
          </div>
        )}
      </form>

      {/* 
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
          <div className="text-center mt-3">{status}</div>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </div>
      </form>

      <div style={{ display: account.email !== "" ? "unset" : "none" }}>
        <h1>Account Settings:</h1>

        <form onSubmit={handleAccountSubmit} style={{ marginBottom: "1em" }}>
          <label htmlFor="email">Email:</label>
          <input name="email" type="email" value={account.email}></input>
          <div style={{ marginBottom: "1em" }}>
            <h2 style={{ fontSize: "1.3em" }}>Version update notifications:</h2>
            <div>
              <label htmlFor="major" style={{ marginRight: "0.5em" }}>
                Major:
              </label>
              <input
                name="major"
                type="checkbox"
                onChange={handleAccountChange}
              ></input>
            </div>
            <div>
              <label htmlFor="minor" style={{ marginRight: "0.5em" }}>
                Minor:
              </label>
              <input
                name="minor"
                type="checkbox"
                onChange={handleAccountChange}
              ></input>
            </div>
            <div>
              <label htmlFor="patch" style={{ marginRight: "0.5em" }}>
                Patch:
              </label>
              <input
                name="patch"
                type="checkbox"
                onChange={handleAccountChange}
              ></input>
            </div>
          </div>
          <div
            className={showAccountStatus ? "visible-message" : "hidden-message"}
            style={{ margin: "0.5em 0em" }}
          >
            <span>{accountStatusMessage}</span>
          </div>
          <button className="btn-blue" type="submit">
            Apply changes
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit}>
          <div
            className="password"
            style={{
              display: passwordModifiable ? "none" : "unset",
            }}
          >
            <label htmlFor="password" style={{ marginRight: "0.5em" }}>
              Password:
            </label>
            <input
              name="password"
              type="password"
              value="password"
              placeholder="password"
              readOnly
            ></input>
          </div>
          <div
            className="modifyPassword"
            style={{ display: passwordModifiable ? "unset" : "none" }}
          >
            <div style={{ display: "block" }}>
              <label htmlFor="oldPassword" style={{ marginRight: "0.5em" }}>
                Old password:
              </label>
              <input
                name="oldPassword"
                type="password"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                required={passwordModifiable ? true : false}
              ></input>
            </div>
            <div style={{ display: "block" }}>
              <label htmlFor="newPassword" style={{ marginRight: "0.5em" }}>
                New password:
              </label>
              <input
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                required={passwordModifiable ? true : false}
              ></input>
            </div>
            <div style={{ display: "block" }}>
              <label
                htmlFor="confirmNewPassword"
                style={{ marginRight: "0.5em" }}
              >
                Confirm new password:
              </label>
              <input
                name="confirmNewPassword"
                type="password"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                required={passwordModifiable ? true : false}
              ></input>
            </div>
          </div>
          <div
            className={
              showPasswordStatus ? "visible-message" : "hidden-message"
            }
            style={{ margin: "0.5em 0em" }}
          >
            <span>{passwordStatusMessage}</span>
          </div>
          <button
            className="btn-blue changePassBtn"
            type={passwordModifiable ? "submit" : "button"}
            onClick={
              passwordModifiable
                ? null
                : () => {
                    setPasswordModifiable(true);
                  }
            }
          >
            Change password
          </button>
        </form>
      </div> */}
    </section>
  );
}
