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
    [passwordForm, setPasswordForm] = useState({
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
        setEmailStatus(err.response.data.errors[0]);
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
        setDetailsStatus(err.response.data.errors[0]);
      });
  };

  const handlePasswordChange = (e) => {
    const input = e.target;
    const tempPasswordForm = _.cloneDeep(passwordForm);

    tempPasswordForm[input.name] = input.value;

    setPasswordForm(tempPasswordForm);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus("Please wait...");
    setShowPasswordStatus(true);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordStatus("Passwords do not match.");
    } else {
      const login = localStorage.getItem("demeter-login");
      const { token } = JSON.parse(login);

      axios
        .put(
          "https://smart-plant.azurewebsites.net/api/User/Password",
          passwordForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setPasswordStatus("Password updated successfully.");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((err) => {
          setDetailsStatus(err.response.data.errors[0]);
        });
    }
  };

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
          <>
            <div
              className={showEmailStatus ? "visible-message" : "hidden-message"}
            >
              <div className="text-center mt-3">{emailStatus}</div>
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-primary" type="submit">
                Apply change
              </button>
            </div>
          </>
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
          <>
            <div
              className={
                showDetailsStatus ? "visible-message" : "hidden-message"
              }
            >
              <div className="text-center mt-3">{detailsStatus}</div>
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-primary" type="submit">
                Apply changes
              </button>
            </div>
          </>
        )}
      </form>

      <form
        className="w-50 m-auto mt-4"
        style={{ marginBottom: "0.75em" }}
        onSubmit={handlePasswordSubmit}
      >
        <div className="container">
          <div className="row">
            {passwordModifiable ? (
              <>
                <div className="col-lg-6">
                  <label className="form-label gold" htmlFor="oldPassword">
                    Old password
                  </label>
                  <input
                    className="form-control"
                    name="oldPassword"
                    type="password"
                    required
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="col-lg-6">
                  <label className="form-label gold" htmlFor="newPassword">
                    New password
                  </label>
                  <input
                    className="form-control"
                    name="newPassword"
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="col-lg-6">
                  <label
                    className="form-label gold"
                    htmlFor="confirmNewPassword"
                  >
                    Confirm new password
                  </label>
                  <input
                    className="form-control"
                    name="confirmNewPassword"
                    type="password"
                    required
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="col-lg-6"></div>
              </>
            ) : (
              <>
                <div className="col-lg-6">
                  <div className="container p-0">
                    <div className="row">
                      <div className="col-sm-10">
                        <span className="gold">Password</span>
                      </div>
                      <div className="col-sm-2 text-end">
                        <FontAwesomeIcon
                          className="gold light-gold-hover"
                          icon={faPen}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setPasswordModifiable(true);
                          }}
                        ></FontAwesomeIcon>
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 py-1 overflow-hidden setting">
                    <span className="ms-1">●●●●●●●●</span>
                  </div>
                </div>
                <div className="col-lg-6"></div>
              </>
            )}
          </div>
        </div>
        {passwordModifiable && (
          <>
            <div
              className={
                showPasswordStatus ? "visible-message" : "hidden-message"
              }
            >
              <div className="text-center mt-3">{passwordStatus}</div>
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-primary" type="submit">
                Change password
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
}
