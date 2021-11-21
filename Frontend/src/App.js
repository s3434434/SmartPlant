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
import AllPlantsAdmin from "./hooks/all_plants_admin/all_plants_admin";
import PlantAdmin from "./hooks/plant_admin/plant_admin";

function App() {
  // Constant for the width of a 'wide' screen in pixels.
  const WIDE_SCREEN_PX = 1200;

  // State variables for whether the user is logged in, whether the user is an administrator and whether the Browser's width is 'wide'. These are used to determine whether certain navbar items are shown, whether particular pages are navigated to, and how the responsive UI behaves.
  const [loggedIn, setLoggedIn] = useState(false),
    [isAdmin, setIsAdmin] = useState(false),
    [wideView, setWideView] = useState(window.innerWidth >= WIDE_SCREEN_PX);

  // Attempts to retrieve the login data (JWT, admin status and JWT expiry) stored in localStorage. A check is first performed as to whether the JWT has expired - if so, the login data is removed. If the login data has expired or does not exist, null is returned.
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

  // useEffect hook that runs a single time when this component loads. Checks if the user is logged in, then sets the loggedIn and admin state variables appropriately. A window listener is then added to update the wideView state variable whenever the window's size is changed, based on whether the window's width is 'wide'.
  useEffect(() => {
    const login = getLogin();
    setLoggedIn(login !== null);
    if (login !== null) {
      setIsAdmin(login.admin);
    }

    window.addEventListener(
      "resize",
      function () {
        setWideView(window.innerWidth >= WIDE_SCREEN_PX);
      },
      true
    );

    // eslint-disable-next-line
  }, []);

  // Removes the login data from localStorage and appropriately sets the loggedIn state variable when the user logs out.
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
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/";
                        }}
                        onKeyPress={() => {
                          window.location.pathname = "/";
                        }}
                      >
                        <h5>Users</h5>
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/plants-admin";
                        }}
                        onKeyPress={() => {
                          window.location.pathname = "/plants-admin";
                        }}
                      >
                        <h5>Plants</h5>
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/logout";
                        }}
                        onKeyPress={() => {
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
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/";
                        }}
                        onKeyPress={() => {
                          window.location.pathname = "/";
                        }}
                      >
                        <h5>Plants</h5>
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/settings";
                        }}
                        onKeyPress={() => {
                          window.location.pathname = "/settings";
                        }}
                      >
                        <h5>Settings</h5>
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/support";
                        }}
                        onKeyPress={() => {
                          window.location.pathname = "/support";
                        }}
                      >
                        <h5>Support</h5>
                      </span>
                    </li>
                    <li className="nav-item">
                      <span
                        className="nav-link"
                        tabIndex="0"
                        onClick={() => {
                          window.location.pathname = "/logout";
                        }}
                        onKeyPress={() => {
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
                    tabIndex="0"
                    onClick={() => {
                      window.location.pathname = "/";
                    }}
                    onKeyPress={() => {
                      window.location.pathname = "/";
                    }}
                  >
                    <h5>Home</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    tabIndex="0"
                    onClick={() => {
                      window.location.pathname = "/login";
                    }}
                    onKeyPress={() => {
                      window.location.pathname = "/login";
                    }}
                  >
                    <h5>Login</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    tabIndex="0"
                    onClick={() => {
                      window.location.pathname = "/register";
                    }}
                    onKeyPress={() => {
                      window.location.pathname = "/register";
                    }}
                  >
                    <h5>Register</h5>
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    tabIndex="0"
                    onClick={() => {
                      window.open(
                        "mailto:email@example.com?subject=Help%With%Demeter"
                      );
                    }}
                    onKeyPress={() => {
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
            <Route
              exact
              path="/landing"
              render={(props) => <LandingPage {...props} wideView={wideView} />}
            />
            <Route
              exact
              path="/login"
              render={(props) => (
                <Login {...props} wideView={wideView} logOut={logOut} />
              )}
            />
            <Route
              exact
              path="/register"
              render={(props) => (
                <Register {...props} wideView={wideView} logOut={logOut} />
              )}
            />
            <Route
              exact
              path="/registration-successful"
              render={(props) => (
                <RegistrationSuccessful {...props} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/confirm-email"
              render={(props) => (
                <ConfirmEmail {...props} logOut={logOut} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/forgot-password"
              render={(props) => (
                <ForgotPassword
                  {...props}
                  logOut={logOut}
                  wideView={wideView}
                />
              )}
            />
            <Route
              exact
              path="/request-processed"
              render={(props) => (
                <RequestProcessed {...props} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/reset-password"
              render={(props) => (
                <ResetPassword {...props} logOut={logOut} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/password-reset-successful"
              render={(props) => (
                <PasswordResetSuccessful {...props} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/logout"
              render={(props) => (
                <Logout
                  {...props}
                  getLogin={getLogin}
                  logOut={logOut}
                  wideView={wideView}
                />
              )}
            />
            <Route
              exact
              path="/plants"
              render={(props) => (
                <AllPlants {...props} getLogin={getLogin} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/add-plant"
              render={(props) => (
                <AddPlant {...props} getLogin={getLogin} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/plant-added"
              render={(props) => <PlantAdded {...props} wideView={wideView} />}
            />
            <Route
              exact
              path="/plant/:plant_id"
              render={(props) => (
                <Plant {...props} getLogin={getLogin} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/settings"
              render={(props) => (
                <Settings {...props} getLogin={getLogin} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/support"
              render={(props) => (
                <Support
                  {...props}
                  getLogin={getLogin}
                  logOut={logOut}
                  wideView={wideView}
                />
              )}
            />
            <Route
              exact
              path="/support-successful"
              render={(props) => (
                <SupportSuccessful {...props} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/privacy-policy"
              render={(props) => (
                <PrivacyPolicy {...props} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/terms-of-use"
              render={(props) => <TermsOfUse {...props} wideView={wideView} />}
            />
            <Route
              exact
              path="/"
              render={() => {
                const login = getLogin();
                return login !== null ? (
                  login.admin ? (
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
              render={(props) => (
                <AllUsers {...props} getLogin={getLogin} wideView={wideView} />
              )}
            />
            <Route
              exact
              path="/user/:user_ID"
              render={(props) => (
                <User
                  {...props}
                  getLogin={getLogin}
                  logOut={logOut}
                  wideView={wideView}
                />
              )}
            />
            <Route
              exact
              path="/plants-admin"
              render={(props) => (
                <AllPlantsAdmin
                  {...props}
                  getLogin={getLogin}
                  wideView={wideView}
                />
              )}
            />
            <Route
              exact
              path="/plant-admin/:plant_id"
              render={(props) => (
                <PlantAdmin
                  {...props}
                  getLogin={getLogin}
                  wideView={wideView}
                />
              )}
            />
            <Route
              path="/*"
              render={(props) => <NotFound {...props} wideView={wideView} />}
            ></Route>
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
              tabIndex="0"
              onClick={() => {
                window.location.pathname = "/terms-of-use";
              }}
              onKeyPress={() => {
                window.location.pathname = "/terms-of-use";
              }}
            >
              Terms of use
            </span>
          </div>
          <div className="col-sm-4 text-center">
            <span
              className="footer-link"
              tabIndex="0"
              onClick={() => {
                window.location.pathname = "/privacy-policy";
              }}
              onKeyPress={() => {
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
