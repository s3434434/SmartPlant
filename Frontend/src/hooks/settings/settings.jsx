import React, { useEffect, useState } from "react";
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
    <section id="account">
      {/* <div style={{ display: account.email !== "" ? "unset" : "none" }}>
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
