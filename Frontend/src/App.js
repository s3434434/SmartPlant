import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

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
import AddPlant from "./hooks/add_plant/add_plant";
import PlantAdded from "./hooks/add_plant/plant_added/plant_added";
import Plant from "./hooks/plant/plant";
import logo from "./assets/images/logo.png";
import PrivacyPolicy from "./hooks/privacy_policy/privacy_policy";
import TermsOfUse from "./hooks/terms_of_use/terms_of_use";
import Support from "./hooks/support/support";
import SupportSuccessful from "./hooks/support/support_successful/support_successful";
import AllUsers from "./hooks/all_users/all_users";
import User from "./hooks/user/user";

function App() {
  const [loggedIn, setLoggedIn] = useState(false),
    [isAdmin, setIsAdmin] = useState(false);

  const getLogin = () => {
    const loginString = localStorage.getItem("demeter-login");
    let login = null;

    if (loginString !== null) {
      const parsedLogin = JSON.parse(loginString);

      if (parsedLogin.expiry >= Date.now()) {
        login = parsedLogin;
      } else {
        localStorage.removeItem("demeter-login");
      }
    }

    return login;
  };

  const getAdminStatus = () => {
    const loginString = localStorage.getItem("demeter-login");
    let adminStatus = null;

    if (loginString !== null) {
      const { expiry, admin } = JSON.parse(loginString);

      if (expiry >= Date.now()) {
        if (admin) {
          adminStatus = true;
        } else {
          adminStatus = false;
        }
      } else {
        localStorage.removeItem("demeter-login");
      }
    }

    return adminStatus;
  };

  useEffect(() => {
    const login = getLogin();
    if (login !== null) {
      setLoggedIn(true);
      setIsAdmin(login.admin);
    } else {
      setLoggedIn(false);
    }

    // eslint-disable-next-line
  }, []);

  const logOut = () => {
    if (getLogin() !== null) {
      localStorage.removeItem("demeter-login");
      setLoggedIn(false);
    }
  };

  return (
    <div className="bg-image">
      <nav
        className="navbar navbar-expand-md sticky-top navbar-dark ps-2 pe-5 py-0"
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
          <img id="nav-image" src={logo} alt="Demeter logo"></img>
          <div className="navbar-title m-auto ms-0">
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
                {isAdmin ? (
                  <>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        onClick={() => {
                          window.location.pathname = "/users";
                        }}
                      >
                        <h5>Users</h5>
                      </span>
                    </li>
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
                )}
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
                      // mailto link
                      window.open(
                        "mailto:email@example.com?subject=Help%With%Demeter"
                      );
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
            <Route exact path="/landing" component={LandingPage} />
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
            <Route
              exact
              path="/forgot-password"
              render={(props) => <ForgotPassword {...props} logOut={logOut} />}
            />
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
              render={(props) => <AllPlants {...props} getLogin={getLogin} />}
            />
            <Route
              exact
              path="/add-plant"
              render={(props) => (
                <AddPlant {...props} getLogin={getLogin} logOut={logOut} />
              )}
            />
            <Route exact path="/plant-added" component={PlantAdded} />
            <Route
              exact
              path="/plant/:plant_name"
              render={(props) => <Plant {...props} getLogin={getLogin} />}
            />
            <Route
              exact
              path="/settings"
              render={(props) => (
                <Settings {...props} getLogin={getLogin} logOut={logOut} />
              )}
            />
            <Route
              exact
              path="/support"
              render={(props) => (
                <Support {...props} getLogin={getLogin} logOut={logOut} />
              )}
            />
            <Route
              exact
              path="/support-successful"
              component={SupportSuccessful}
            />
            <Route
              exact
              path="/privacy-policy"
              render={(props) => <PrivacyPolicy {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/terms-of-use"
              render={(props) => <TermsOfUse {...props} logOut={logOut} />}
            />
            <Route
              exact
              path="/"
              render={() => {
                const adminStatus = getAdminStatus();
                return adminStatus !== null ? (
                  adminStatus ? (
                    <Redirect to="/users" />
                  ) : (
                    <Redirect to="/plants" />
                  )
                ) : (
                  <Redirect to="/landing" />
                );
              }}
            />
            <Route
              exact
              path="/users"
              render={(props) => <AllUsers {...props} getLogin={getLogin} />}
            />
            <Route
              exact
              path="/user/:user_ID"
              render={(props) => <User {...props} getLogin={getLogin} />}
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
    </div>
  );
}

export default App;
