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
    [emailStatus, setEmailStatus] = useState("none"),
    [showDetailsStatus, setShowDetailsStatus] = useState(false),
    [detailsStatus, setDetailsStatus] = useState("none"),
    [showPasswordStatus, setShowPasswordStatus] = useState(false),
    [passwordStatus, setPasswordStatus] = useState("none");

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

    if (emailForm.email !== emailForm.confirmEmail) {
      setEmailStatus("Email do not match.");
    } else {
      const login = localStorage.getItem("demeter-login");
      const { token } = JSON.parse(login);

      axios
        .put(
          "https://smart-plant.azurewebsites.net/api/User/Email",
          emailForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          setEmailStatus(err.response.data.errors.ConfirmEmail[0]);
        });
    }
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
        const data = err.response.data;
        let errorMessage = "";

        if (data.error !== undefined) {
          errorMessage = data.error[0];
        } else {
          const errors = data.errors;
          Object.keys(errors).forEach((error) => {
            if (errors[error] !== undefined) {
              errorMessage = errors[error];
            }
          });
        }

        setDetailsStatus(errorMessage);
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
          setPasswordStatus(err.response.data);
        });
    }
  };

  return (
    <section>
      <h1 className="text-center gold">Settings</h1>

      <form
        className="w-25 m-auto mt-4 d-none d-lg-block"
        onSubmit={handleEmailSubmit}
      >
        {emailModifiable ? (
          <>
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

            <label className="form-label gold mt-2" htmlFor="confirmEmail">
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
          </>
        ) : (
          <>
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
          </>
        )}
        <div className={showEmailStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{emailStatus}</span>
        </div>
        <div className={emailModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form className="m-auto mt-4 px-2 d-lg-none" onSubmit={handleEmailSubmit}>
        {emailModifiable ? (
          <>
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

            <label className="form-label gold mt-2" htmlFor="confirmEmail">
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
          </>
        ) : (
          <>
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
          </>
        )}
        <div className={showEmailStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{emailStatus}</span>
        </div>
        <div className={emailModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto mt-5 d-none d-lg-block"
        onSubmit={handleDetailsSubmit}
      >
        {phoneNumberModifiable ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
        {firstNameModifiable ? (
          <>
            <label className="form-label gold mt-2" htmlFor="firstName">
              First name
            </label>
            <input
              className="form-control"
              name="firstName"
              type="text"
              value={detailsForm.firstName}
              onChange={handleDetailsChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
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
          </>
        )}
        {lastNameModifiable ? (
          <>
            <label className="form-label gold mt-2" htmlFor="lastName">
              Last name
            </label>
            <input
              className="form-control"
              name="lastName"
              type="text"
              value={detailsForm.lastName}
              onChange={handleDetailsChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
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
          </>
        )}
        <div
          className={showDetailsStatus ? "text-center mt-3" : "hidden-field"}
        >
          <span>{detailsStatus}</span>
        </div>
        <div
          className={detailsModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Apply changes
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-lg-none"
        onSubmit={handleDetailsSubmit}
      >
        {phoneNumberModifiable ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
        {firstNameModifiable ? (
          <>
            <label className="form-label gold mt-2" htmlFor="firstName">
              First name
            </label>
            <input
              className="form-control"
              name="firstName"
              type="text"
              value={detailsForm.firstName}
              onChange={handleDetailsChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
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
          </>
        )}
        {lastNameModifiable ? (
          <>
            <label className="form-label gold mt-2" htmlFor="lastName">
              Last name
            </label>
            <input
              className="form-control"
              name="lastName"
              type="text"
              value={detailsForm.lastName}
              onChange={handleDetailsChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
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
          </>
        )}
        <div
          className={showDetailsStatus ? "text-center mt-3" : "hidden-field"}
        >
          <span>{detailsStatus}</span>
        </div>
        <div
          className={detailsModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Apply changes
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto mt-5 d-none d-lg-block"
        onSubmit={handlePasswordSubmit}
      >
        {passwordModifiable ? (
          <>
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
            <label className="form-label gold mt-2" htmlFor="newPassword">
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
            <label
              className="form-label gold mt-2"
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
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
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
              <span className="ms-1">••••••••</span>
            </div>
          </>
        )}
        <div
          className={showPasswordStatus ? "text-center mt-3" : "hidden-field"}
        >
          <span>{passwordStatus}</span>
        </div>
        <div
          className={passwordModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Change password
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-lg-none"
        onSubmit={handlePasswordSubmit}
      >
        {passwordModifiable ? (
          <>
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
            <label className="form-label gold mt-2" htmlFor="newPassword">
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
            <label
              className="form-label gold mt-2"
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
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
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
              <span className="ms-1">••••••••</span>
            </div>
          </>
        )}
        <div
          className={showPasswordStatus ? "text-center mt-3" : "hidden-field"}
        >
          <span>{passwordStatus}</span>
        </div>
        <div
          className={passwordModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Change password
          </button>
        </div>
      </form>
    </section>
  );
}