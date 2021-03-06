import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import Pagination from "../pagination/pagination";
import "./user.css";

export default function User(props) {
  const { getLogin, logOut, wideView } = props;

  // Constant for the user ID from the URL path.
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;
  const userID = window.location.pathname.substr(startIndex);

  // State variables for the user role, user details form and user password form. State variables are also created for whether or not these forms and state variables are currently modifiable, the statuses of their associated requests, and whether these statuses are being shown.
  // A state variable is also created for the user's plants.
  const [role, setRole] = useState("Loading..."),
    [detailsForm, setDetailsForm] = useState({
      email: "",
      phoneNumber: "",
      firstName: "",
      lastName: "",
    }),
    [passwordForm, setPasswordForm] = useState({
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
    [emailStatus, setEmailStatus] = useState("-"),
    [showRoleStatus, setShowRoleStatus] = useState(false),
    [roleStatus, setRoleStatus] = useState("-"),
    [showDetailsStatus, setShowDetailsStatus] = useState(false),
    [detailsStatus, setDetailsStatus] = useState("-"),
    [showPasswordStatus, setShowPasswordStatus] = useState(false),
    [passwordStatus, setPasswordStatus] = useState("-"),
    [showDeleteStatus, setShowDeleteStatus] = useState(false),
    [deleteStatus, setDeleteStatus] = useState("-"),
    [plants, setPlants] = useState("Loading plants...");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in and an administrator on the UI. If not, the user is returned to the root path.
  // Otherwise, two GET requests are made - one to the backend individual user admin endpoint and one to the Plants admin endpoint.

  // The GET request to the individual user endpoint proceeds as follows:
  // If the request is unsuccessful, the user is returned to the root path Otherwise, the response array is iterated through to find a plant with a matching plant ID. If no such plant is found, the user is returned to the root path.
  // Otherwise, the user details form state variable is updated with the response data. A GET request is then performed to the backend User roles admin endpoint. If this request is unsuccessful, the user is returned to the root path.
  // Otherwise, the response user roles array is iterated through to find a user with a user ID matching that of user ID in the user details form state variable. If no such user is found, the user is returned to the root path.
  // Otherwise, the role state variable is updated with the value of the role of the found user.

  // The GET request to the Plants admin endpoint proceeds as follows:
  // If the request is unsuccessful, the user is returned to the root path.
  // Otherwise, an empty 'user plants' array is created. The returned plants array is iterated through, and all plants that have a user ID matching that of the user details form state variable are added to the 'user plants' array. The 'user' plants array is then sorted.
  // Finally, a check is done on whether the 'user plants' array has a length greater than 0. If so, the plants state variable is updated with the value of the 'user plants' array.
  // Otherwise, the plants state variable is updated with an appropriate message.
  useEffect(() => {
    document.title = "Demeter - The plant meter";

    const login = getLogin();
    if (login !== null) {
      const { token, admin } = login;

      if (admin) {
        axios
          .get(
            `https://smart-plant.azurewebsites.net/api/Admin/User?userID=${userID}`,
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
              .get(
                "https://smart-plant.azurewebsites.net/api/Admin/User/Role",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                let roleFound = false;
                res.data.forEach((foundUser) => {
                  if (foundUser.id === userID) {
                    setRole(foundUser.role);
                    roleFound = true;
                  }
                });

                if (!roleFound) {
                  window.location.pathname = "/";
                }
              })
              .catch((err) => {
                window.location.pathname = "/";
              });
          })
          .catch((err) => {
            window.location.pathname = "/";
          });

        axios
          .get("https://smart-plant.azurewebsites.net/api/Admin/Plants", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            let userPlants = [];
            res.data.forEach((plant) => {
              if (plant.userID === userID) {
                userPlants.push(plant);
              }
            });
            userPlants = userPlants.sort((a, b) => {
              const nameA = a.name,
                nameB = b.name;
              return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });

            if (userPlants.length > 0) {
              setPlants(userPlants);
            } else {
              setPlants("No current plants.");
            }
          })
          .catch((err) => {
            window.location.pathname = "/";
          });
      } else {
        window.location.pathname = "/";
      }
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  // Updates the role state variable whenever the role input field is updated.
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  // Handles the submit event of the role form. The role status is set appropriately, then a check is performed on whether a role has been selected. If not, an appropriate error message is shown.
  // Otherwise, a second check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a PUT request is made to the backend update role admin endpoint. If this request is unsuccessful, an appropriate error message is shown. Otherwise, the page is reloaded.
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
          { id: userID, role: role },
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

  // Updates the user details form state variable with the appropriate input field whenever a user details form input field is updated.
  const handleDetailsChange = (e) => {
    const input = e.target;
    const tempDetailsForm = _.cloneDeep(detailsForm);

    tempDetailsForm[input.name] = input.value;

    setDetailsForm(tempDetailsForm);
  };

  // Handles the submit event of the user details form. The user details status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a PUT request is made to the backend update user details admin endpoint with the user details form state variable and the user ID from the URL path. If this request is unsuccessful, an appropriate error message is shown. Otherwise, the page is reloaded.
  const handleDetailsSubmit = (e, setStatus, setShowStatus) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      const detailsFormData = _.cloneDeep(detailsForm);
      detailsFormData.id = userID;
      axios
        .put(
          "https://smart-plant.azurewebsites.net/api/Admin/User",
          detailsFormData,
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

  // Updates the password form state variable with the appropriate input field whenever a password form input field is updated.
  const handlePasswordChange = (e) => {
    const input = e.target;
    const tempPasswordForm = _.cloneDeep(passwordForm);

    tempPasswordForm[input.name] = input.value;

    setPasswordForm(tempPasswordForm);
  };

  // Handles the submit event of the password form. The password form request status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a check is performed on whether the form's 'newPassword' and 'confirmNewPassword' fields match. If not, an appropriate error message is shown.
  // Otherwise, a PUT request is made to the backend change password admin endpoint with the password form state variable and the user ID from the URL path. If this request is successful, an appropriate message is shown and the page is reloaded. Otherwise, an appropriate error message is shown.
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordStatus("Please wait...");
    setShowPasswordStatus(true);

    const login = getLogin();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordStatus("New passwords do not match.");
    } else if (login !== null) {
      const { token } = login;
      const passwordFormData = _.cloneDeep(passwordForm);
      passwordFormData.id = userID;
      axios
        .put(
          "https://smart-plant.azurewebsites.net/api/Admin/User/Password",
          passwordFormData,
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
          setPasswordStatus(err.response.data[0].description);
        });
    } else {
      setPasswordStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  // Attempts to delete the user. The delete user status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a DELETE request is made to the backend delete user admin endpoint. If this request is unsuccessful, an appropriate error message is shown.
  // Otherwise, a check is performed on whether the deleted user has the same user ID as the currently logged in user. If so, the user is logged out on the UI and returned to the root path.
  // Otherwise, the page is reloaded.
  const deleteUser = () => {
    setDeleteStatus("Please wait...");
    setShowDeleteStatus(true);

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
          const currentEmail = res.data.email;

          axios
            .delete(
              `https://smart-plant.azurewebsites.net/api/Admin/User?userID=${userID}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              if (currentEmail === detailsForm.email) {
                logOut();
                window.location.pathname = "/";
              } else {
                window.location.reload();
              }
            })
            .catch((err) => {
              setDeleteStatus("Server error. Please try again later.");
            });
        })
        .catch((err) => {
          setDeleteStatus("Server error. Please try again later.");
        });
    } else {
      setDeleteStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  return (
    <section>
      {detailsForm.email !== "" ? (
        <>
          {wideView ? (
            <div className="container m-0 p-0">
              <div className="row">
                <div className="col-xl-2 text-center">
                  <div className={showDeleteStatus ? "" : "hidden-field"}>
                    <span style={{ color: "white" }}>{deleteStatus}</span>
                  </div>
                  <button className="btn btn-primary mt-2" onClick={deleteUser}>
                    Delete user
                  </button>
                </div>
                <div className="col-xl-10"></div>
              </div>
            </div>
          ) : (
            <>
              <div
                className={showDeleteStatus ? "text-center" : "hidden-field"}
              >
                <span style={{ color: "white" }}>{deleteStatus}</span>
              </div>
              <div className="text-center">
                <button className="btn btn-primary mt-2" onClick={deleteUser}>
                  Delete user
                </button>
              </div>
            </>
          )}

          <form
            className={wideView ? "m-auto" : "m-auto px-2"}
            onSubmit={(e) => {
              handleDetailsSubmit(e, setEmailStatus, setShowEmailStatus);
            }}
          >
            {emailModifiable ? (
              <div className={wideView ? "w-25 m-auto" : ""}>
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
              </div>
            ) : (
              <>
                <div className={wideView ? "w-25 m-auto" : ""}>
                  <div className="text-end m-0 p-0">
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
                <h1
                  className={
                    wideView
                      ? "text-center gold m-0 mb-2 p-0"
                      : "text-center gold m-0 mb-2 p-0 overflow-hidden"
                  }
                >
                  {detailsForm.email}
                </h1>
              </>
            )}
            <div
              className={
                showEmailStatus
                  ? "text-center mt-3"
                  : wideView
                  ? "hidden-field m-0"
                  : "hidden-field"
              }
            >
              <span>{emailStatus}</span>
            </div>
            <div
              className={
                emailModifiable
                  ? "text-center my-3"
                  : wideView
                  ? "hidden-field m-0"
                  : "hidden-field"
              }
            >
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
            className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
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
                  <option key="default" value="">
                    Please select a role
                  </option>
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
                <div
                  style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
                >
                  <div className="text-left">
                    <span className="gold">Role</span>
                  </div>
                  <div className="text-end">
                    <FontAwesomeIcon
                      className="gold light-gold-hover"
                      tabIndex="0"
                      icon={faPen}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setRoleModifiable(true);
                      }}
                      onKeyPress={() => {
                        setRoleModifiable(true);
                      }}
                    ></FontAwesomeIcon>
                  </div>
                </div>

                <div className="mt-1 py-1 overflow-hidden gold-border">
                  <span className="ms-1">{role}</span>
                </div>
              </>
            )}
            <div
              className={showRoleStatus ? "text-center mt-3" : "hidden-field"}
            >
              <span>{roleStatus}</span>
            </div>
            <div
              className={roleModifiable ? "text-center mt-3" : "hidden-field"}
            >
              <button
                className="btn btn-primary"
                tabIndex={roleModifiable ? "0" : "-1"}
                type="submit"
              >
                Apply change
              </button>
            </div>
          </form>

          <form
            className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
            onSubmit={(e) => {
              handleDetailsSubmit(e, setDetailsStatus, setShowDetailsStatus);
            }}
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
                  className={wideView ? "" : "mt-2"}
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
                  className="mt-2"
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
                  className="mt-2"
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
              className={
                showDetailsStatus ? "text-center mt-3" : "hidden-field"
              }
            >
              <span>{detailsStatus}</span>
            </div>
            <div
              className={
                detailsModifiable ? "text-center mt-3" : "hidden-field"
              }
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
            className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
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
                  <span className="ms-1">????????????????????????</span>
                </div>
              </>
            )}
            <div
              className={
                showPasswordStatus ? "text-center mt-3" : "hidden-field"
              }
            >
              <span>{passwordStatus}</span>
            </div>
            <div
              className={
                passwordModifiable ? "text-center mt-3" : "hidden-field"
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

          <h1 className="text-center gold mt-4">Plants</h1>
          {typeof plants === "string" ? (
            <div
              className={
                wideView ? "text-center mt-3" : "text-center mt-3 mb-2"
              }
              style={{ color: "white" }}
            >
              {plants}
            </div>
          ) : (
            <Pagination
              items={plants}
              itemID="plantID"
              heading1="Name"
              heading2="Variety"
              imageCol={true}
              itemTitle1="name"
              itemTitle2="plantType"
              path="plant-admin"
              wideView={wideView}
            ></Pagination>
          )}
        </>
      ) : (
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
          style={{ color: "white" }}
        >
          Loading user...
        </div>
      )}
    </section>
  );
}
