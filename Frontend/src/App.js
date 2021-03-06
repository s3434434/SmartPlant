import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./hooks/home/home";
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
import PrivacyPolicy from "./hooks/privacy_policy/privacy_policy";
import TermsOfUse from "./hooks/terms_of_use/terms_of_use";
import Support from "./hooks/support/support";
import SupportSuccessful from "./hooks/support/support_successful/support_successful";
import AllUsers from "./hooks/all_users/all_users";
import User from "./hooks/user/user";
import AllPlantsAdmin from "./hooks/all_plants_admin/all_plants_admin";
import PlantAdmin from "./hooks/plant_admin/plant_admin";

function App() {
  // Constant for the width of a 'wide' screen in pixels, the width of a screen where the full navbar is showing, the CDN URL for Demeter's logo and the support email for users who are not logged in.
  const WIDE_SCREEN_PX = 1200,
    FULL_NAV_PX = 768,
    logo = "https://d3utxwpu6rqzip.cloudfront.net/logo.png",
    supportEmail = "mailto:email@example.com?subject=Help%With%Demeter";

  // State variables for whether the user is logged in, whether the user is an administrator, whether the Browser's window's width is 'wide', and whether the it is a width where the full navbar is showing. These are used to determine whether certain navbar items are shown, whether particular pages are navigated to, and how the responsive UI behaves.
  const [loggedIn, setLoggedIn] = useState(false),
    [isAdmin, setIsAdmin] = useState(false),
    [wideView, setWideView] = useState(window.innerWidth >= WIDE_SCREEN_PX),
    [fullNav, setFullNav] = useState(window.innerWidth >= FULL_NAV_PX);

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

  // useEffect hook that runs a single time when this component loads. Checks if the user is logged in, then sets the loggedIn and admin state variables appropriately. A window listener is then added to update the wideView and fullNav state variables whenever the window's size is changed, based on whether the window's width is 'wide', and whether window's width is such that the full navbar is showing.
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
        setFullNav(window.innerWidth >= FULL_NAV_PX);
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
        className={
          fullNav
            ? "navbar navbar-expand-md sticky-top navbar-dark py-0 ps-4 overflow-hidden"
            : "navbar navbar-expand-md sticky-top navbar-dark py-0 overflow-hidden"
        }
        id="navbar"
      >
        <button
          className="navbar-toggler ms-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-options"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="navbar-brand"
          style={{
            display: "grid",
            gridTemplateColumns: fullNav ? "50% 50%" : "40% 60%",
          }}
        >
          <img id="brand-image" src={logo} alt="Demeter logo"></img>
          <div
            id="brand-title"
            className={fullNav ? "m-auto ms-0" : "m-auto ms-0 me-3"}
          >
            <h1 className="gold">Demeter</h1>
            <h4 className="gold">The Plant Meter</h4>
          </div>
        </div>
        <div
          className={
            fullNav
              ? "collapse navbar-collapse justify-content-start align-center ms-4"
              : "collapse navbar-collapse justify-content-start align-center"
          }
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
                      window.open(supportEmail);
                    }}
                    onKeyPress={() => {
                      window.open(supportEmail);
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
          <Routes>
            <Route
              exact
              path="/landing"
              element={<LandingPage wideView={wideView} />}
            />
            <Route
              exact
              path="/login"
              element={<Login wideView={wideView} logOut={logOut} />}
            />
            <Route
              exact
              path="/register"
              element={<Register wideView={wideView} logOut={logOut} />}
            />
            <Route
              exact
              path="/registration-successful"
              element={<RegistrationSuccessful wideView={wideView} />}
            />
            <Route
              exact
              path="/confirm-email"
              element={<ConfirmEmail logOut={logOut} wideView={wideView} />}
            />
            <Route
              exact
              path="/forgot-password"
              element={<ForgotPassword logOut={logOut} wideView={wideView} />}
            />
            <Route
              exact
              path="/request-processed"
              element={<RequestProcessed wideView={wideView} />}
            />
            <Route
              exact
              path="/reset-password"
              element={<ResetPassword logOut={logOut} wideView={wideView} />}
            />
            <Route
              exact
              path="/password-reset-successful"
              element={<PasswordResetSuccessful wideView={wideView} />}
            />
            <Route
              exact
              path="/logout"
              element={
                <Logout
                  getLogin={getLogin}
                  logOut={logOut}
                  wideView={wideView}
                />
              }
            />
            <Route
              exact
              path="/plants"
              element={<AllPlants getLogin={getLogin} wideView={wideView} />}
            />
            <Route
              exact
              path="/add-plant"
              element={<AddPlant getLogin={getLogin} wideView={wideView} />}
            />
            <Route
              exact
              path="/plant-added"
              element={<PlantAdded wideView={wideView} />}
            />
            <Route
              exact
              path="/plant/:plant_id"
              element={<Plant getLogin={getLogin} wideView={wideView} />}
            />
            <Route
              exact
              path="/settings"
              element={<Settings getLogin={getLogin} wideView={wideView} />}
            />
            <Route
              exact
              path="/support"
              element={
                <Support
                  getLogin={getLogin}
                  logOut={logOut}
                  wideView={wideView}
                />
              }
            />
            <Route
              exact
              path="/support-successful"
              element={<SupportSuccessful wideView={wideView} />}
            />
            <Route
              exact
              path="/privacy-policy"
              element={<PrivacyPolicy wideView={wideView} />}
            />
            <Route
              exact
              path="/terms-of-use"
              element={<TermsOfUse wideView={wideView} />}
            />
            <Route exact path="/" element={<Home getLogin={getLogin}></Home>} />
            <Route
              exact
              path="/users"
              element={<AllUsers getLogin={getLogin} wideView={wideView} />}
            />
            <Route
              exact
              path="/user/:user_ID"
              element={
                <User getLogin={getLogin} logOut={logOut} wideView={wideView} />
              }
            />
            <Route
              exact
              path="/plants-admin"
              element={
                <AllPlantsAdmin getLogin={getLogin} wideView={wideView} />
              }
            />
            <Route
              exact
              path="/plant-admin/:plant_id"
              element={<PlantAdmin getLogin={getLogin} wideView={wideView} />}
            />
            <Route path="/*" element={<NotFound wideView={wideView} />}></Route>
          </Routes>
        </BrowserRouter>
      </main>
      <footer className="container-fluid justify-content-center">
        <div className="row">
          <div className="col-sm-4 text-center" style={{ cursor: "default" }}>
            <span>Developed by Team 4, 2021 ??</span>
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
