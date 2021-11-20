import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import "./settings.css";

export default function Settings(props) {
  const { getLogin, wideView } = props;

  // State variables for the email, account details and password forms, whether or not these forms are modifiable, the statuses of these forms' associated requests, and whether these statuses are being shown.
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
    [emailStatus, setEmailStatus] = useState("-"),
    [showDetailsStatus, setShowDetailsStatus] = useState(false),
    [detailsStatus, setDetailsStatus] = useState("-"),
    [showPasswordStatus, setShowPasswordStatus] = useState(false),
    [passwordStatus, setPasswordStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in on the UI. If not, the user is returned to the root path.
  // Otherwise, a GET request is made to the User endpoint of the backend. If this request is unsuccessful, the user is returned to the root path.
  // Otherwise, the email and account details forms are updated with the response data.
  useEffect(() => {
    document.title = "Settings | Demeter - The plant meter";

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
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
          window.location.pathname = "/";
        });
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  // Updates the emailForm state variable with the appropriate input field whenever a email form input field is updated.
  const handleEmailChange = (e) => {
    const input = e.target;
    const tempEmailForm = _.cloneDeep(emailForm);

    tempEmailForm[input.name] = input.value;

    setEmailForm(tempEmailForm);
  };

  // Handles the submit event of the email form. The email request status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a check is performed on whether the form's 'email' and 'confirmEmail' fields match. If not, an appropriate error message is shown.
  // Otherwise, a PUT request is made to the backend change email endpoint. If this request is successful, the page is reloaded. Otherwise, an appropriate error message is shown.
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailStatus("Please wait...");
    setShowEmailStatus(true);

    const login = getLogin();
    if (emailForm.email !== emailForm.confirmEmail) {
      setEmailStatus("Emails do not match.");
    } else if (login !== null) {
      const { token } = login;
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
          const errors = err.response.data.errors;
          let errorMessage = "Server error. Please try again later.";

          if (errors.Email !== undefined) {
            errorMessage = errors.Email[0];
          } else if (errors.ConfirmEmail !== undefined) {
            errorMessage = errors.ConfirmEmail[0];
          }

          setEmailStatus(errorMessage);
        });
    } else {
      setEmailStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  // Updates the detailsForm state variable with the appropriate input field whenever an account details form input field is updated.
  const handleDetailsChange = (e) => {
    const input = e.target;
    const tempDetailsForm = _.cloneDeep(detailsForm);

    tempDetailsForm[input.name] = input.value;

    setDetailsForm(tempDetailsForm);
  };

  // Handles the submit event of the account details form. The details form request status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a PUT request is made to the backend change account details endpoint. If this request is successful, the page is reloaded. Otherwise, an appropriate error message is shown.
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setDetailsStatus("Please wait...");
    setShowDetailsStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
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
          const errors = err.response.data.messages;
          let errorMessage = "Server error. Please try again later.";

          if (errors.Phone !== undefined) {
            errorMessage = errors.Phone[0];
          } else if (errors.FirstName !== undefined) {
            errorMessage = errors.FirstName[0];
          } else if (errors.LastName !== undefined) {
            errorMessage = errors.LastName[0];
          }

          setDetailsStatus(errorMessage);
        });
    } else {
      setDetailsStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  // Updates the passwordForm state variable with the appropriate input field whenever a password form input field is updated.
  const handlePasswordChange = (e) => {
    const input = e.target;
    const tempPasswordForm = _.cloneDeep(passwordForm);

    tempPasswordForm[input.name] = input.value;

    setPasswordForm(tempPasswordForm);
  };

  // Handles the submit event of the password form. The password form request status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a check is performed on whether the form's 'newPassword' and 'confirmNewPassword' fields match. If not, an appropriate error message is shown.
  // Otherwise, a PUT request is made to the backend change password endpoint. If this request is successful, an appropriate message is shown and the page is reloaded. Otherwise, an appropriate error message is shown.
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus("Please wait...");
    setShowPasswordStatus(true);

    const login = getLogin();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordStatus("New passwords do not match.");
    } else if (login !== null) {
      const { token } = login;
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
          const errors = err.response.data.messages;
          let errorMessage = "Server error. Please try again later.";

          if (errors.PasswordMismatch !== undefined) {
            errorMessage = errors.PasswordMismatch[0];
          }
          if (errors.PasswordTooShort !== undefined) {
            errorMessage = errors.PasswordTooShort[0];
          } else if (errors.ConfirmNewPassword !== undefined) {
            errorMessage = errors.ConfirmNewPassword[0];
          }

          setPasswordStatus(errorMessage);
        });
    } else {
      setPasswordStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  return (
    <section>
      <h1 className="text-center gold">Settings</h1>

      <form
        className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
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
            <div
              className="p-0"
              style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
            >
              <div className="text-left">
                <span className="gold">Email</span>
              </div>
              <div className="text-end">
                <FontAwesomeIcon
                  className="gold light-gold-hover"
                  tabIndex="0"
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setEmailModifiable(true);
                  }}
                  onKeyPress={() => {
                    setEmailModifiable(true);
                  }}
                ></FontAwesomeIcon>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{emailForm.email}</span>
            </div>
          </>
        )}
        <div className={showEmailStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{emailStatus}</span>
        </div>
        <div className={emailModifiable ? "text-center mt-3" : "hidden-field"}>
          <button
            className="btn btn-primary"
            tabIndex={emailModifiable ? "0" : "-1"}
            type="submit"
          >
            Apply change
          </button>
        </div>
      </form>

      <form
        className={wideView ? "w-25 m-auto mt-5" : "m-auto mt-5 px-2"}
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
            <div
              className="p-0"
              style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
            >
              <div className="text-left">
                <span className="gold">Phone</span>
              </div>
              <div className="text-end">
                <FontAwesomeIcon
                  className="gold light-gold-hover"
                  tabIndex="0"
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetailsModifiable(true);
                    setPhoneNumberModifiable(true);
                  }}
                  onKeyPress={() => {
                    setDetailsModifiable(true);
                    setPhoneNumberModifiable(true);
                  }}
                ></FontAwesomeIcon>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
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
            <div
              className="mt-2 p-0"
              style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
            >
              <div className="text-left">
                <span className="gold">First name</span>
              </div>
              <div className="text-end">
                <FontAwesomeIcon
                  className="gold light-gold-hover"
                  tabIndex="0"
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetailsModifiable(true);
                    setFirstNameModifiable(true);
                  }}
                  onKeyPress={() => {
                    setDetailsModifiable(true);
                    setFirstNameModifiable(true);
                  }}
                ></FontAwesomeIcon>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
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
            <div
              className="mt-2 p-0"
              style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
            >
              <div className="text-left">
                <span className="gold">Last name</span>
              </div>
              <div className="text-end">
                <FontAwesomeIcon
                  className="gold light-gold-hover"
                  tabIndex="0"
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDetailsModifiable(true);
                    setLastNameModifiable(true);
                  }}
                  onKeyPress={() => {
                    setDetailsModifiable(true);
                    setLastNameModifiable(true);
                  }}
                ></FontAwesomeIcon>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
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
          <button
            className="btn btn-primary"
            tabIndex={detailsModifiable ? "0" : "-1"}
            type="submit"
          >
            Apply changes
          </button>
        </div>
      </form>

      <form
        className={wideView ? "w-25 m-auto mt-5" : "m-auto mt-5 px-2"}
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
            <div
              className="mt-2 p-0"
              style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
            >
              <div className="text-left">
                <span className="gold">Password</span>
              </div>
              <div className="text-end">
                <FontAwesomeIcon
                  className="gold light-gold-hover"
                  tabIndex="0"
                  icon={faPen}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setPasswordModifiable(true);
                  }}
                  onKeyPress={() => {
                    setPasswordModifiable(true);
                  }}
                ></FontAwesomeIcon>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
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
          className={
            passwordModifiable
              ? wideView
                ? "text-center mt-3"
                : "text-center mt-3 mb-2"
              : "hidden-field"
          }
        >
          <button
            className="btn btn-primary"
            tabIndex={passwordModifiable ? "0" : "-1"}
            type="submit"
          >
            Change password
          </button>
        </div>
      </form>
    </section>
  );
}
