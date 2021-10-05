import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import axios from "axios";
import Plant from "./hooks/plant/plant";
import LandingPage from "./hooks/landingpage/landingpage";
import Login from "./hooks/login/login";
import Register from "./hooks/register/register";
import Settings from "./hooks/settings/settings";
import NotFound from "./hooks/notfound/notfound";
import AllPlants from "./hooks/allplants/allplants";
import logo from "./assets/images/logo.png";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const checkLoggedIn = () => {
    let currentUser = localStorage.getItem("current-user");
    let loggedIn = false;
    if (currentUser) {
      axios
        .get("https://smart-plant.azurewebsites.net/api/User", {
          headers: {
            Authorization: "Bearer " + currentUser,
          },
        })
        .then((res) => {
          loggedIn = true;
        })
        .catch((err) => {
          localStorage.removeItem("current-user");
        });
    }

    setLoggedIn(loggedIn);
  };

  useEffect(() => {
    checkLoggedIn();
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
    if (loggedIn) {
      localStorage.removeItem("current-user");
      setLoggedIn(false);
      window.location.pathname = "/landing";
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
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/";
                    }}
                  >
                    <h5>Plants</h5>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/settings";
                    }}
                  >
                    <h5>Settings</h5>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/support";
                    }}
                  >
                    <h5>Support</h5>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={logOut}>
                    <h5>Logout</h5>
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/";
                    }}
                  >
                    <h5>Home</h5>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/login";
                    }}
                  >
                    <h5>Login</h5>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/register";
                    }}
                  >
                    <h5>Register</h5>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    onClick={() => {
                      window.location.pathname = "/support";
                    }}
                  >
                    <h5>Support</h5>
                  </a>
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
            <Route exact path="/register" component={Register} />
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
            <span>Developed by Team 4 ©</span>
          </div>
          <div className="col-sm-4 text-center">
            <a
              onClick={() => {
                window.location.pathname = "/terms-of-use";
              }}
            >
              Terms of use
            </a>
          </div>
          <div className="col-sm-4 text-center">
            <a
              onClick={() => {
                window.location.pathname = "/privacy-policy";
              }}
            >
              Privacy policy
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
