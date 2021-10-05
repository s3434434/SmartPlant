import React, { Fragment, useState, useEffect } from "react";
import "./allplants.css";
import _ from "lodash";

export default function AllPlants(props) {
  const {
    getCurrentUser,
    getPlants,
    openOverlay,
    closeOverlay,
    getFileInputLabel,
  } = props;
  const [plants, setPlants] = useState();
  const [form, setForm] = useState({
    name: "",
    type: "Select a package manager",
    dependencies: "",
  });
  const [fileInputLabel, setFileInputLabel] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    document.title = "Plants | Dependency Tracker";

    getPlants(setPlants);
    // eslint-disable-next-line
  }, []);

  const getImage = (type, mouseOver) => {
    let image;

    // switch (type) {
    //   case "npm":
    //     if (mouseOver) {
    //       image = npm_05;
    //     } else {
    //       image = npm_07;
    //     }
    //     break;
    //   case "pypi":
    //     if (mouseOver) {
    //       image = pypi_05;
    //     } else {
    //       image = pypi_07;
    //     }
    //     break;
    //   default:
    //     break;
    // }

    return image;
  };

  const handleChange = (e) => {
    const input = e.target,
      name = e.target.name,
      value = e.target.value;
    const tempForm = _.cloneDeep(form);

    if (name === "dependencies") {
      tempForm[name] = input.files[0];
    } else {
      if (name === "type") {
        setFileInputLabel(getFileInputLabel(value));
      }
      tempForm[name] = value;
    }

    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowStatus(false);

    const { name, type, dependencies } = form;

    if (type === "Select a package manager") {
      setStatusMessage("A package manager must be selected.");
      setShowStatus(true);
    } else if (
      (type === "npm" && dependencies.name !== "package.json") ||
      (type === "pypi" && dependencies.name !== "requirements.txt")
    ) {
      setStatusMessage("Please upload the correct file format.");
      setShowStatus(true);
    } else {
      setStatusMessage("Creating plant...");
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

                  const createPlant = async () => {
                    const response = await fetch(
                      `https://43wwya78h8.execute-api.us-east-2.amazonaws.com/prod/plants?email=${email}&name=${name}&type=${type}&update=false`,
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
                      setPlants(json);

                      closeOverlay("overlay-form");
                    } else {
                      setStatusMessage(json);
                    }
                  };
                  createPlant();
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

  return (
    <section id="all-plants">
      <div style={{ display: "none" }}>
        {/* <img src={npm_05} alt=""></img>
        <img src={npm_07} alt=""></img>
        <img src={pypi_05} alt=""></img>
        <img src={pypi_07} alt=""></img> */}
      </div>
      <div id="overlay-form" className="overlay">
        <i
          className="fa fa-close closeBtn"
          onClick={() => {
            closeOverlay("overlay-form");
          }}
        ></i>
        <div className="overlay-content">
          <form onSubmit={handleSubmit}>
            <label htmlFor="text">Plant name:</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="Select a package manager">
                Select a package manager
              </option>
              <option value="npm">npm</option>
              <option value="pypi">PyPI</option>
            </select>
            <div>
              <label htmlFor="dependencies">{`Dependencies file${fileInputLabel}:`}</label>
              <input
                name="dependencies"
                type="file"
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className={showStatus ? "visible-message" : "hidden-message"}>
              <span>{statusMessage}</span>
            </div>
            <button className="btn-blue" type="submit">
              Create
            </button>
          </form>
        </div>
      </div>
      {plants ? (
        <Fragment>
          <h1 style={{ marginBottom: "0em" }}>Plants:</h1>
          <div className="create-plant" style={{ marginBottom: "2em" }}>
            <button
              className="btn-blue"
              onClick={() => {
                openOverlay("overlay-form");
              }}
            >
              Create plant
            </button>
          </div>
          <div className={"content-gallery cg-flex"}>
            {Object.keys(plants).length > 0 ? (
              Object.keys(plants)
                .sort()
                .map((plant) => {
                  return (
                    <div className="flex-padding" key={plants[plant].name}>
                      <div
                        id={plant}
                        className="cg-container"
                        style={{
                          backgroundImage: `url(${getImage(
                            plants[plant].type,
                            false
                          )})`,
                        }}
                        onMouseEnter={() => {
                          document.getElementById(
                            plant
                          ).style.backgroundImage = `url(${getImage(
                            plants[plant].type,
                            true
                          )})`;
                        }}
                        onMouseLeave={() => {
                          document.getElementById(
                            plant
                          ).style.backgroundImage = `url(${getImage(
                            plants[plant].type,
                            false
                          )})`;
                        }}
                        onClick={(e) => {
                          window.location.pathname = `/plant/${plant}`;
                        }}
                      >
                        <h1>{plant}</h1>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p>No current plants.</p>
            )}
          </div>
        </Fragment>
      ) : null}
    </section>
  );
}
