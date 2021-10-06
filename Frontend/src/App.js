import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Plant from "./hooks/plant/plant";
import LandingPage from "./hooks/landing_page/landing_page";
import Login from "./hooks/login/login";
import Register from "./hooks/register/register";
import RegistrationSuccessful from "./hooks/register/registration_successful/registration_successful";
import ConfirmEmail from "./hooks/register/confirm_email/confirm_email";
import ForgotPassword from "./hooks/forgot_password/forgot_password";
import RequestProcessed from "./hooks/forgot_password/request_processed/request_processed";
import ResetPassword from "./hooks/forgot_password/reset_password/reset_password";
import PasswordResetSuccessful from "./hooks/forgot_password/password_reset_successful/password_reset_successful";
import Logout from "./hooks/logout/logout";
import Settings from "./hooks/settings/settings";
import NotFound from "./hooks/not_found/not_found";
import AllPlants from "./hooks/all_plants/all_plants";
import logo from "./assets/images/logo.png";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const checkLoggedIn = () => {
    const login = localStorage.getItem("demeter-login");
    let loginStatus = false;

    if (login) {
      const { expiry } = JSON.parse(login);

      if (expiry >= Date.now()) {
        loginStatus = true;
      } else {
        localStorage.removeItem("demeter-login");
      }
    }

    return loginStatus;
  };

  useEffect(() => {
    setLoggedIn(checkLoggedIn());
    // eslint-disable-next-line
  }, []);

  const getPlants = (callback) => {
    // getCurrentUser()
    //   .then((user) => {
    //     user.getSession((err, session) => {
    //       if (!err) {
    //         user.getUserAttributes((err, attributes) => {
    //           if (!err) {
    //             let email = "";
    //             attributes.forEach((attribute) => {
    //               if (attribute.getName() === "email") {
    //                 email = attribute.getValue();
    //               }
    //             });
    //             const fetchPlants = async () => {
    //               const response = await fetch(
    //                 `https://43wwya78h8.execute-api.us-east-2.amazonaws.com/prod/plants?email=${email}`,
    //                 {
    //                   headers: {
    //                     Authorization: session.getIdToken().getJwtToken(),
    //                   },
    //                 }
    //               );
    //               const json = await response.json();
    //               callback(json);
    //             };
    //             fetchPlants();
    //           }
    //         });
    //       }
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     window.location.pathname = "/login";
    //   });
    // eslint-disable-next-line
  };

  const logOut = () => {
    if (checkLoggedIn()) {
      localStorage.removeItem("demeter-login");
      setLoggedIn(false);
    }
  };

  const openOverlay = (id) => {
    document.getElementById(id).style.width = "82%";
  };

  const closeOverlay = (id) => {
    document.getElementById(id).style.width = "0%";
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-sm sticky-top navbar-dark px-2 py-0"
        id="navbar"
      >
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-options"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="navbar-brand"
          style={{ display: "grid", gridTemplateColumns: "50% 50%" }}
        >
          <img className="img-fluid" src={logo} alt="Demeter logo"></img>
          <div className="navbar-title m-auto ms-1">
            <h1 className="gold">Demeter</h1>
            <h4 className="gold">The Plant Meter</h4>
          </div>
        </div>
        <div
          className="collapse navbar-collapse justify-content-start align-center ms-4"
          id="nav-options"
        >
          <ul className="navbar-nav">
            {loggedIn ? (
              <>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/";
                    }}
                  >
                    <h5>Plants</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/settings";
                    }}
                  >
                    <h5>Settings</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/support";
                    }}
                  >
                    <h5>Support</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/logout";
                    }}
                  >
                    <h5>Logout</h5>
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/";
                    }}
                  >
                    <h5>Home</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/login";
                    }}
                  >
                    <h5>Login</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/register";
                    }}
                  >
                    <h5>Register</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/support";
                    }}
                  >
                    <h5>Support</h5>
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      <main>
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/landing"
              render={(props) => <LandingPage {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/login"
              render={(props) => <Login {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/register"
              render={(props) => <Register {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/registration-successful"
              component={RegistrationSuccessful}
            />
            <Route
              exact
              path="/confirm-email"
              render={(props) => <ConfirmEmail {...props} logOut={logOut} />}
            />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
              exact
              path="/request-processed"
              component={RequestProcessed}
            />
            <Route
              exact
              path="/reset-password"
              render={(props) => <ResetPassword {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/password-reset-successful"
              component={PasswordResetSuccessful}
            />
            <Route
              exact
              path="/logout"
              render={(props) => <Logout {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/plants"
              render={(props) => (
                <AllPlants
                  {...props}
                  getPlants={getPlants}
                  openOverlay={openOverlay}
                  closeOverlay={closeOverlay}
                />
              )}
            />
            <Route
              exact
              path="/plant/:plant_name"
              render={(props) => (
                <Plant
                  {...props}
                  getPlants={getPlants}
                  openOverlay={openOverlay}
                  closeOverlay={closeOverlay}
                />
              )}
            />
            <Route exact path="/settings" component={Settings} />
            <Route
              exact
              path="/"
              render={() => {
                return loggedIn ? (
                  <Redirect to="/plants" />
                ) : (
                  <Redirect to="/landing" />
                );
              }}
            />
            <Route path="/*" component={NotFound}></Route>
          </Switch>
        </BrowserRouter>
      </main>
      <footer className="container-fluid justify-content-center">
        <div className="row">
          <div className="col-sm-4 text-center" style={{ cursor: "default" }}>
            <span>Developed by Team 4, 2021 ©</span>
          </div>
          <div className="col-sm-4 text-center">
            <span
              className="footer-link"
              onClick={() => {
                window.location.pathname = "/terms-of-use";
              }}
            >
              Terms of use
            </span>
          </div>
          <div className="col-sm-4 text-center">
            <span
              className="footer-link"
              onClick={() => {
                window.location.pathname = "/privacy-policy";
              }}
            >
              Privacy policy
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
