import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import "./user.css";

export default function User(props) {
  const { getLogin, logOut } = props;
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;

  const [role, setRole] = useState(""),
    [detailsForm, setDetailsForm] = useState({
      id: window.location.pathname.substr(startIndex),
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
    }),
    [passwordForm, setPasswordForm] = useState({
      id: window.location.pathname.substr(startIndex),
      newPassword: "",
      confirmNewPassword: "",
    }),
    [emailModifiable, setEmailModifiable] = useState(false),
    [roleModifiable, setRoleModifiable] = useState(false),
    [detailsModifiable, setDetailsModifiable] = useState(false),
    [phoneNumberModifiable, setPhoneNumberModifiable] = useState(false),
    [firstNameModifiable, setFirstNameModifiable] = useState(false),
    [lastNameModifiable, setLastNameModifiable] = useState(false),
    [passwordModifiable, setPasswordModifiable] = useState(false),
    [showEmailStatus, setShowEmailStatus] = useState(false),
    [emailStatus, setEmailStatus] = useState("none"),
    [showRoleStatus, setShowRoleStatus] = useState(false),
    [roleStatus, setRoleStatus] = useState("none"),
    [showDetailsStatus, setShowDetailsStatus] = useState(false),
    [detailsStatus, setDetailsStatus] = useState("none"),
    [showPasswordStatus, setShowPasswordStatus] = useState(false),
    [passwordStatus, setPasswordStatus] = useState("none");

  useEffect(() => {
    document.title = "Demeter - The plant meter";

    const login = getLogin();
    if (login !== null) {
      const { token, admin } = login;

      if (admin) {
        axios
          .get(
            `https://smart-plant.azurewebsites.net/api/Admin/User?userID=${detailsForm.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            const userData = res.data;
            document.title = `${userData.email} | Demeter - The plant meter`;

            const tempDetailsForm = _.cloneDeep(detailsForm);
            tempDetailsForm.email = userData.email;
            tempDetailsForm.phoneNumber = userData.phoneNumber;
            tempDetailsForm.firstName = userData.firstName;
            tempDetailsForm.lastName = userData.lastName;
            setDetailsForm(tempDetailsForm);

            axios
              .get("https://smart-plant.azurewebsites.net/api/User/Role", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((res) => {
                setRole(res.data);
              })
              .catch((err) => {
                window.location.pathname = "/users";
              });
          })
          .catch((err) => {
            window.location.pathname = "/users";
          });
      } else {
        window.location.pathname = "/";
      }
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    setRoleStatus("Please wait...");
    setShowRoleStatus(true);

    const login = getLogin();
    if (role !== "User" && role !== "Admin") {
      setRoleStatus("An appropriate role must be selected.");
    } else if (login !== null) {
      const { token } = login;
      axios
        .put(
          "https://smart-plant.azurewebsites.net/api/Admin/User/Role",
          { id: detailsForm.id, role: role },
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
          setRoleStatus("Server error. Please try again later.");
        });
    } else {
      setRoleStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  const handleDetailsChange = (e) => {
    const input = e.target;
    const tempDetailsForm = _.cloneDeep(detailsForm);

    tempDetailsForm[input.name] = input.value;

    setDetailsForm(tempDetailsForm);
  };

  const handleDetailsSubmit = (e, setStatus, setShowStatus) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .put(
          "https://smart-plant.azurewebsites.net/api/Admin/User",
          detailsForm,
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
          const errors = err.response.data.messages;
          let errorMessage = "Server error. Please try again later.";

          if (errors.Email !== undefined) {
            errorMessage = errors.Email[0];
          } else if (errors.ConfirmEmail !== undefined) {
            errorMessage = errors.ConfirmEmail[0];
          } else if (errors.Phone !== undefined) {
            errorMessage = errors.Phone[0];
          } else if (errors.FirstName !== undefined) {
            errorMessage = errors.FirstName[0];
          } else if (errors.LastName !== undefined) {
            errorMessage = errors.LastName[0];
          }

          setStatus(errorMessage);
        });
    } else {
      setStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
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
      <form
        className="w-25 m-auto d-none d-xl-block"
        onSubmit={(e) => {
          handleDetailsSubmit(e, setEmailStatus, setShowEmailStatus);
        }}
      >
        {emailModifiable ? (
          <>
            <label className="form-label gold" htmlFor="email">
              Email
            </label>
            <input
              className="form-control mb-3"
              name="email"
              type="text"
              value={detailsForm.email}
              onChange={handleDetailsChange}
            />
          </>
        ) : (
          <>
            <div className="text-end m-0 p-0">
              <FontAwesomeIcon
                className="gold light-gold-hover"
                icon={faPen}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEmailModifiable(true);
                }}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-center gold m-0 mb-2 p-0">
              {detailsForm.email}
            </h1>
          </>
        )}
        <div className={showEmailStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{emailStatus}</span>
        </div>
        <div className={emailModifiable ? "text-center my-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form
        className="m-auto px-2 d-xl-none"
        onSubmit={(e) => {
          handleDetailsSubmit(e, setEmailStatus, setShowEmailStatus);
        }}
      >
        {emailModifiable ? (
          <>
            <label className="form-label gold" htmlFor="email">
              Email
            </label>
            <input
              className="form-control mb-3"
              name="email"
              type="text"
              value={detailsForm.email}
              onChange={handleDetailsChange}
            />
          </>
        ) : (
          <>
            <div className="text-end m-0 p-0">
              <FontAwesomeIcon
                className="gold light-gold-hover"
                icon={faPen}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEmailModifiable(true);
                }}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-center gold m-0 mb-2 p-0">
              {detailsForm.email}
            </h1>
          </>
        )}
        <div className={showEmailStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{emailStatus}</span>
        </div>
        <div className={emailModifiable ? "text-center my-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto mt-4 d-none d-xl-block"
        onSubmit={handleRoleSubmit}
      >
        {roleModifiable ? (
          <>
            <label className="form-label gold" htmlFor="role">
              Role
            </label>
            <select
              className="form-control"
              name="role"
              onChange={handleRoleChange}
              required
            >
              <option key="User" value="User">
                User
              </option>
              <option key="Admin" value="Admin">
                Admin
              </option>
            </select>
          </>
        ) : (
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10">
                  <span className="gold">Role</span>
                </div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setRoleModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{role}</span>
            </div>
          </>
        )}
        <div className={showRoleStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{roleStatus}</span>
        </div>
        <div className={roleModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form className="m-auto mt-4 px-2 d-xl-none" onSubmit={handleRoleSubmit}>
        {roleModifiable ? (
          <>
            <label className="form-label gold" htmlFor="role">
              Role
            </label>
            <select
              className="form-control"
              name="role"
              onChange={handleRoleChange}
              required
            >
              <option key="User" value="User">
                User
              </option>
              <option key="Admin" value="Admin">
                Admin
              </option>
            </select>
          </>
        ) : (
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10">
                  <span className="gold">Role</span>
                </div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setRoleModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{role}</span>
            </div>
          </>
        )}
        <div className={showRoleStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{roleStatus}</span>
        </div>
        <div className={roleModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto mt-5 d-none d-xl-block"
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
          <button className="btn btn-primary" type="submit">
            Apply changes
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-xl-none"
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
          <button className="btn btn-primary" type="submit">
            Apply changes
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto mt-5 d-none d-xl-block"
        onSubmit={handlePasswordSubmit}
      >
        {passwordModifiable ? (
          <>
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
          className={passwordModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Change password
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-xl-none"
        onSubmit={handlePasswordSubmit}
      >
        {passwordModifiable ? (
          <>
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
