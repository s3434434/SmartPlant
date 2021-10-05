import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./plant.css";
import _ from "lodash";

export default function Plant(props) {
  const {
    getCurrentUser,
    getPlants,
    openOverlay,
    closeOverlay,
    getFileInputLabel,
  } = props;
  const { plant_name } = useParams();

  const [plant, setPlant] = useState({});
  const [currentDependency, setCurrentDependency] = useState({
    dependency: "",
    version: {
      prefix: "",
      major: "",
      minor: "",
      patch: "",
    },
    latest_version: {
      major: "",
      minor: "",
      patch: "",
    },
  });
  const [currentDependencyLoading, setCurrentDependencyLoading] =
    useState(false);

  const [form, setForm] = useState({
    dependencies: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const callback = (plants) => {
      let plantFound = false;

      let tempPlant;

      Object.keys(plants).forEach((key) => {
        if (key === plant_name) {
          tempPlant = plants[key];
          plantFound = true;
        }
      });

      if (plantFound) {
        document.title = `${plant_name} | Dependency Tracker`;

        setPlant(tempPlant);
      } else {
        window.location.pathname = "/notfound";
      }
    };
    getPlants(callback);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentDependencyLoading) {
      closeOverlay("overlay-form");
      openOverlay("overlay-dependency");
    }
  }, [currentDependencyLoading, openOverlay, closeOverlay]);

  const getImage = (type) => {
    let image;

    // switch (type) {
    //   case "npm":
    //     image = npm;
    //     break;
    //   case "pypi":
    //     image = pypi;
    //     break;
    //   default:
    //     break;
    // }

    return image;
  };

  const getVersionString = (version) => {
    let prefix = "";
    if (version["prefix"] !== undefined) {
      prefix = version["prefix"];
    }

    return `${prefix}${version["major"]}.${version["minor"]}.${version["patch"]}`;
  };

  const compareVersions = (version, latest_version) => {
    let versionDifference = "none";

    if (version["major"] < latest_version["major"]) {
      versionDifference = "major";
    } else if (
      version["minor"] < latest_version["minor"] &&
      version["prefix"] !== "^"
    ) {
      versionDifference = "minor";
    } else if (
      version["patch"] < latest_version["patch"] &&
      version["prefix"] === ""
    ) {
      versionDifference = "patch";
    }

    return versionDifference;
  };

  const getUpdateMessage = (version, latest_version) => {
    let updateMessage = "No updates available.";

    switch (compareVersions(version, latest_version)) {
      case "patch":
        updateMessage =
          "Patch update available. Check the repository for bug fixes.";
        break;
      case "minor":
        updateMessage =
          "Minor update available. Check the repository for backwards compatible changes and deprecations.";
        break;
      case "major":
        updateMessage =
          "Major update available. Check the repository for backwards incompatible changes, backwards compatible changes and deprecations.";
        break;
      default:
        break;
    }

    return updateMessage;
  };

  const getUpdateIndicator = (version, latest_version) => {
    let versionDifference = compareVersions(version, latest_version),
      updateClass = "no-updates",
      updateIndicator = "✓";

    if (versionDifference !== "none") {
      updateClass = versionDifference;
    }

    switch (updateClass) {
      case "patch":
        updateIndicator = "p";
        break;
      case "minor":
        updateIndicator = "m";
        break;
      case "major":
        updateIndicator = "M";
        break;
      default:
        break;
    }

    return <strong className={updateClass}>{updateIndicator}</strong>;
  };

  const getLatestDependency = async (dependency, version) => {
    setCurrentDependencyLoading(true);

    getCurrentUser()
      .then((user) => {
        user.getSession((err, session) => {
          if (!err) {
            user.getUserAttributes((err, attributes) => {
              if (!err) {
                let email = "";

                attributes.forEach((attribute) => {
                  if (attribute.getName() === "email") {
                    email = attribute.getValue();
                  }
                });

                const fetchLatestDependency = async () => {
                  const response = await fetch(
                    `https://43wwya78h8.execute-api.us-east-2.amazonaws.com/prod/latest-version?email=${email}&name=${plant_name}&type=${
                      plant["type"]
                    }&dependency=${dependency.replace("/", "~")}`,
                    {
                      method: "get",
                      headers: {
                        Authorization: session.getIdToken().getJwtToken(),
                      },
                    }
                  );

                  const json = await response.json();

                  setCurrentDependency({
                    dependency: dependency,
                    version: plant["dependencies"][dependency]["version"],
                    latest_version: json,
                  });

                  setCurrentDependencyLoading(false);
                };
                fetchLatestDependency();
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        window.location.pathname = "/login";
      });
  };

  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);

    tempForm[input.name] = input.files[0];

    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowStatus(false);

    const { dependencies } = form,
      type = plant["type"];

    if (
      (type === "npm" && dependencies.name !== "package.json") ||
      (type === "pypi" && dependencies.name !== "requirements.txt")
    ) {
      setStatusMessage("Please upload the correct file format.");
      setShowStatus(true);
    } else {
      setStatusMessage("Updating dependencies...");
      setShowStatus(true);

      getCurrentUser()
        .then((user) => {
          user.getSession((err, session) => {
            if (!err) {
              user.getUserAttributes((err, attributes) => {
                if (!err) {
                  let email = "";

                  attributes.forEach((attribute) => {
                    if (attribute.getName() === "email") {
                      email = attribute.getValue();
                    }
                  });

                  const updateDependencies = async () => {
                    const response = await fetch(
                      `https://43wwya78h8.execute-api.us-east-2.amazonaws.com/prod/plants?email=${email}&name=${plant_name}&type=${type}&update=true`,
                      {
                        method: "post",
                        headers: {
                          Authorization: session.getIdToken().getJwtToken(),
                        },
                        body: dependencies,
                      }
                    );

                    const json = await response.json();

                    if (response.ok) {
                      setShowStatus(false);
                      setPlant(json[plant_name]);

                      closeOverlay("overlay-form");
                    } else {
                      setStatusMessage(json);
                    }
                  };
                  updateDependencies();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          window.location.pathname = "/login";
        });
    }
  };

  const deletePlant = async () => {
    getCurrentUser()
      .then((user) => {
        user.getSession((err, session) => {
          if (!err) {
            user.getUserAttributes((err, attributes) => {
              if (!err) {
                let email = "";

                attributes.forEach((attribute) => {
                  if (attribute.getName() === "email") {
                    email = attribute.getValue();
                  }
                });

                const removePlant = async () => {
                  const response = await fetch(
                    `https://43wwya78h8.execute-api.us-east-2.amazonaws.com/prod/plants/delete?email=${email}&name=${plant_name}`,
                    {
                      method: "get",
                      headers: {
                        Authorization: session.getIdToken().getJwtToken(),
                      },
                    }
                  );

                  if (response.ok) {
                    window.location.pathname = "/";
                  }
                };
                removePlant();
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        window.location.pathname = "/login";
      });
  };

  return (
    <section id="plant">
      <div id="overlay-form" className="overlay">
        <i
          className="fa fa-close closeBtn"
          onClick={() => {
            closeOverlay("overlay-form");
          }}
        ></i>
        <div className="overlay-content">
          {Object.keys(plant).length > 0 ? (
            <form onSubmit={handleSubmit}>
              <label htmlFor="dependencies">{`Dependencies file${getFileInputLabel(
                plant["type"]
              )}:`}</label>
              <input
                name="dependencies"
                type="file"
                onChange={handleChange}
                required
              ></input>
              <div
                className={showStatus ? "visible-message" : "hidden-message"}
              >
                <span>{statusMessage}</span>
              </div>
              <button className="btn-blue" type="submit">
                Update
              </button>
            </form>
          ) : null}
        </div>
      </div>
      <div
        id="overlay-dependency"
        className="overlay"
        style={{ overflow: "auto" }}
      >
        <i
          className="fa fa-close closeBtn"
          onClick={() => {
            closeOverlay("overlay-dependency");
          }}
        ></i>
        <div className="overlay-content">
          <h1
            className="heading"
            style={{ fontSize: "3em", marginTop: "1em", marginBottom: "0em" }}
          >
            {currentDependencyLoading ? (
              "Loading dependency details..."
            ) : (
              <Fragment>
                <strong>{currentDependency["dependency"]}</strong>
                <strong
                  className="plant-version"
                  style={{ marginLeft: "0.5em" }}
                >
                  {Object.keys(plant).length > 0
                    ? getVersionString(currentDependency["version"])
                    : null}
                </strong>
                {compareVersions(
                  currentDependency["version"],
                  currentDependency["latest_version"]
                ) === "none" ? (
                  <strong className="equals" style={{ marginLeft: "0.5em" }}>
                    ==
                  </strong>
                ) : (
                  <strong className="less-than" style={{ marginLeft: "0.5em" }}>
                    {"<"}
                  </strong>
                )}
                <strong id="latest-version" style={{ marginLeft: "0.5em" }}>
                  {Object.keys(plant).length > 0
                    ? getVersionString(currentDependency["latest_version"])
                    : null}
                </strong>
              </Fragment>
            )}
          </h1>
          {currentDependencyLoading ? null : (
            <Fragment>
              <h3
                style={{
                  textAlign: "center",
                  margin: "auto",
                  marginTop: "1em",
                  marginBottom: "1.4em",
                  fontSize: "1.35em",
                  width: "70%",
                }}
              >
                {getUpdateMessage(
                  currentDependency["version"],
                  currentDependency["latest_version"]
                )}
              </h3>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {currentDependency["latest_version"]["info"]}
              </p>
            </Fragment>
          )}
        </div>
      </div>
      {Object.keys(plant).length > 0 ? (
        <Fragment>
          <div
            style={{
              width: "100%",
              height: "10em",
              backgroundColor: "white",
              marginBottom: "1em",
            }}
          >
            <img
              src={getImage(plant["type"])}
              alt={plant["type"]}
              style={{ margin: "auto", display: "block", height: "inherit" }}
            />
          </div>
          <h1 className="heading" style={{ marginBottom: "0em" }}>
            <strong>{plant_name}</strong>
          </h1>
          <div
            style={{
              display: "inline-flex",
              marginBottom: "2em",
            }}
          >
            <button
              className="btn-blue"
              onClick={() => {
                closeOverlay("overlay-dependency");
                openOverlay("overlay-form");
              }}
              style={{ marginRight: "1em" }}
            >
              Update dependencies
            </button>
            <button className="btn-blue" onClick={deletePlant}>
              Delete plant
            </button>
          </div>
          <div style={{ marginBottom: "2em", textAlign: "center" }}>
            <h3 style={{ display: "inline", marginRight: "1em" }}>
              <strong className="no-updates">✓</strong>
              <span className="equals"> == </span>
              <span>No updates available</span>
            </h3>
            <h3 style={{ display: "inline", marginRight: "1em" }}>
              <strong className="patch">p</strong>
              <span className="equals"> == </span>
              <span>Patch update available</span>
            </h3>
            <h3 style={{ display: "inline", marginRight: "1em" }}>
              <strong className="minor">m</strong>
              <span className="equals"> == </span>
              <span> Minor update available</span>
            </h3>
            <h3 style={{ display: "inline" }}>
              <strong className="major">M</strong>
              <span className="equals"> == </span>
              <span> Major update available</span>
            </h3>
          </div>
          <div className={"content-gallery cg-flex"}>
            {Object.keys(plant["dependencies"])
              .sort()
              .map((dependency) => {
                return (
                  <div className="flex-padding" key={dependency}>
                    <div
                      id={dependency}
                      className="cg-container"
                      style={{
                        backgroundColor: "white",
                      }}
                      onMouseEnter={() => {
                        document.getElementById(
                          dependency
                        ).style.backgroundColor = "lightgrey";
                      }}
                      onMouseLeave={() => {
                        document.getElementById(
                          dependency
                        ).style.backgroundColor = "white";
                      }}
                      onClick={(e) => {
                        getLatestDependency(
                          dependency,
                          plant["dependencies"][dependency]["version"]
                        );
                      }}
                    >
                      <h2
                        style={{
                          textAlign: "right",
                          width: "6em",
                          position: "absolute",
                          margin: "0em",
                          marginLeft: "0.5em",
                          padding: "0em",
                          fontSize: "2.2em",
                        }}
                      >
                        {getUpdateIndicator(
                          plant["dependencies"][dependency]["version"],
                          plant["dependencies"][dependency]["latest_version"]
                        )}
                      </h2>
                      <h2>{dependency}</h2>
                      <h2 className="plant-version">
                        {getVersionString(
                          plant["dependencies"][dependency]["version"]
                        )}
                      </h2>
                    </div>
                  </div>
                );
              })}
          </div>
        </Fragment>
      ) : null}
    </section>
  );
}
