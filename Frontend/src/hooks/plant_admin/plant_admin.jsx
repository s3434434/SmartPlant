import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import container_no_image from "../../assets/images/container_no_image.png";
import SensorPagination from "../sensor_pagination/sensor_pagination";
import "./plant_admin.css";

export default function PlantAdmin(props) {
  const { getLogin, wideView } = props;

  // Constant for the plant ID from the URL path.
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;
  const plantID = window.location.pathname.substr(startIndex);

  // State variables for the plant name, whether or not the name is modifiable, the status of the associated request, and whether the status is being shown. State variables are also created for the plant image, the status of the associated delete request, and whether the status is being shown.
  //State variables are also created for the plant type, user ID, user email, Arduino token regeneration status and whether that status is being shown, sensor data readings, and plant delete status and whether that status is being shown.
  const [name, setName] = useState(""),
    [nameModifiable, setNameModifiable] = useState(false),
    [showNameStatus, setShowNameStatus] = useState(false),
    [nameStatus, setNameStatus] = useState("-"),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("-"),
    [plantType, setPlantType] = useState(""),
    [userID, setUserID] = useState(""),
    [email, setEmail] = useState(""),
    [plantImage, setPlantImage] = useState(null),
    [showTokenStatus, setShowTokenStatus] = useState(false),
    [tokenStatus, setTokenStatus] = useState("-"),
    [sensorReadings, setSensorReadings] = useState(null),
    [showDeleteStatus, setShowDeleteStatus] = useState(false),
    [deleteStatus, setDeleteStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in and an administrator on the UI. If not, the user is returned to the root path.
  // Otherwise, two GET requests are made - one to the backend Plants admin endpoint and one to the backend SensorData admin endpoint.

  // The GET request to the Plants admin endpoint proceeds as follows:
  // If the request is unsuccessful, the user is returned to the root path Otherwise, the response array is iterated through to find a plant with a matching plant ID. If no such plant is found, the user is returned to the root path.
  // Otherwise, a GET request is performed to the backend Users admin endpoint. If this request is unsuccessful, the user is returned to the root path.
  // Otherwise, the response users array is iterated through to find a user with a user ID matching that of the matching plant ID. If no such user is found, the user is returned to the root path.
  // Otherwise, title of the web page is updated appropriately, the 'email' state variable is set to that of the found user, the 'name' state variable is set to the plant's name, the plantImage state variable is set to either the found plant's image or a default one depending if it exists, the plantType state variable is set to the plant's type, and the userID state variable is set to that of the found user.

  // The GET request to the SensorData admin endpoint proceeds as follows:
  // If the request is unsuccessful, an appropriate error message is shown in the sensor data table. Otherwise, the sensor readings response data array is sorted according to the timestamp of each reading, then the array is assigned to the sensorReadings state variable.
  useEffect(() => {
    document.title = "Demeter - The plant meter";

    const login = getLogin();
    if (login !== null) {
      const { token, admin } = login;

      if (admin) {
        axios
          .get("https://smart-plant.azurewebsites.net/api/Admin/Plants", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            let plantFound = false;

            res.data.forEach((plant) => {
              if (plant.plantID === plantID) {
                axios
                  .get(
                    "https://smart-plant.azurewebsites.net/api/Admin/Users",
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  )
                  .then((res) => {
                    let userFound = false;
                    res.data.forEach((user) => {
                      if (user.id === plant.userID) {
                        setEmail(user.email);
                        userFound = true;
                      }
                    });

                    if (!userFound) {
                      window.location.pathname = "/";
                    }

                    document.title = `${plant.name} | Demeter - The plant meter`;

                    setName(plant.name);

                    let image = container_no_image;
                    if (plant.imgurURL !== null) {
                      image = plant.imgurURL;
                    }
                    setPlantImage(image);

                    setPlantType(plant.plantType);
                    setUserID(plant.userID);
                  })
                  .catch((err) => {
                    window.location.pathname = "/";
                  });

                plantFound = true;
              }
            });

            if (!plantFound) {
              window.location.pathname = "/";
            }
          })
          .catch((err) => {
            window.location.pathname = "/";
          });

        axios
          .get(
            `https://smart-plant.azurewebsites.net/api/Admin/SensorData/${plantID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            const sortedReadings = res.data.sort((a, b) => {
              const timeA = new Date(a.timeStampUTC).getTime(),
                timeB = new Date(b.timeStampUTC).getTime();
              return timeA > timeB ? -1 : timeA < timeB ? 1 : 0;
            });
            setSensorReadings(sortedReadings);
          })
          .catch((err) => {
            setSensorReadings(
              "There was an error retrieving the sensor data. Please try again later."
            );
          });
      } else {
        window.location.pathname = "/";
      }
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  // Updates the name state variable  whenever the name input field is updated.
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handles the submit event of the plant name form. The status parameter is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a GET request is made to the backend individual user plants admin endpoint using the userID state variable. If this request is unsuccessful, an appropriate error message is shown.
  // Otherwise, the returned individual user plants array is iterated through, with a check being done on each plant to determine whether the new plant name matches that of any of the user's existing plants. If a match is found an appropriate error message is shown.
  // Otherwise, a PUT request is made to the backend update plant admin endpoint using the name state variable and the plant ID from the URL path. If this request is successful the page is reloaded. Otherwise, an appropriate error message is shown.
  const handleNameSubmit = (e) => {
    e.preventDefault();
    setNameStatus("Please wait...");
    setShowNameStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;

      axios
        .get(
          `https://smart-plant.azurewebsites.net/api/Admin/Plants/User/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          let nameExists = false;
          res.data.forEach((plant) => {
            if (plant.name === name) {
              nameExists = true;
            }
          });

          if (!nameExists) {
            axios
              .put(
                "https://smart-plant.azurewebsites.net/api/Admin/Plants",
                { name: name, plantID: plantID },
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

                if (errors.PlantName !== undefined) {
                  errorMessage = errors.PlantName[0];
                } else if (errors["Name"] !== undefined) {
                  errorMessage = errors["Name"][0];
                } else if (errors["Name Taken"] !== undefined) {
                  errorMessage = errors["Name Taken"][0];
                }

                setNameStatus(errorMessage);
              });
          } else {
            setNameStatus(
              `A plant with this name already exists for ${email}.`
            );
          }
        })
        .catch((err) => {
          setNameStatus("Server error. Please try again later.");
        });
    } else {
      setNameStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  // Attempts to delete the plant's image. The delete image status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a DELETE request is made to the backend delete plant image admin endpoint. If this request is successful, the page is reloaded. Otherwise, an appropriate error message is shown.
  const deleteImage = () => {
    setImageStatus("Please wait...");
    setShowImageStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .delete(
          `https://smart-plant.azurewebsites.net/api/Admin/Plants/Image?userID=${userID}&plantID=${plantID}`,
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
          setImageStatus("Server error. Please try again later.");
        });
    } else {
      setImageStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  // Attempts to regenerate the plant's Arduino token. The token regeneration status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a POST request is made to the backend Plant new token admin endpoint. If this request is successful, an appropriate message is shown. Otherwise, an appropriate error message is shown.
  const regenerateArduinoToken = () => {
    setTokenStatus("Please wait...");
    setShowTokenStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;

      axios
        .post(
          `https://smart-plant.azurewebsites.net/api/Admin/Plants/NewToken/${userID}/${plantID}`,
          {
            userID: userID,
            plantID: plantID,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setTokenStatus("Arduino token regenerated.");
        })
        .catch((err) => {
          setTokenStatus("Server error. Please try again later.");
        });
    } else {
      setTokenStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  // Attempts to delete the plant. The delete plant status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a DELETE request is made to the backend delete plant admin endpoint. If this request is successful, the user is navigated back to the previous page. Otherwise, an appropriate error message is shown.
  const deletePlant = () => {
    setDeleteStatus("Please wait...");
    setShowDeleteStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .delete(
          `https://smart-plant.azurewebsites.net/api/Admin/Plants?plantID=${plantID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          window.location.assign(document.referrer);
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
      {plantImage !== null ? (
        <>
          {wideView ? (
            <div className="container m-0 p-0">
              <div className="row">
                <div className="col-xl-2 text-center">
                  <div className={showDeleteStatus ? "" : "hidden-field"}>
                    <span style={{ color: "white" }}>{deleteStatus}</span>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={deletePlant}
                  >
                    Delete plant
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
                <button className="btn btn-primary mt-2" onClick={deletePlant}>
                  Delete plant
                </button>
              </div>
            </>
          )}

          <form
            className={wideView ? "m-auto" : "m-auto px-2"}
            onSubmit={handleNameSubmit}
          >
            {nameModifiable ? (
              <>
                <div className={wideView ? "w-25 m-auto" : ""}>
                  <label className="form-label gold" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="form-control mb-3"
                    name="name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
                  {plantType}
                </h4>
              </>
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
                        setNameModifiable(true);
                      }}
                      onKeyPress={() => {
                        setNameModifiable(true);
                      }}
                    ></FontAwesomeIcon>
                  </div>
                </div>
                <h1 className="text-center gold m-0 mb-2 p-0">{name}</h1>
                <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
                  {plantType}
                </h4>
              </>
            )}
            <div
              className={
                showNameStatus
                  ? "text-center mt-3"
                  : wideView
                  ? "hidden-field m-0"
                  : "hidden-field"
              }
            >
              <span>{nameStatus}</span>
            </div>
            <div
              className={
                nameModifiable
                  ? "text-center my-3"
                  : wideView
                  ? "hidden-field m-0"
                  : "hidden-field"
              }
            >
              <button
                className="btn btn-primary"
                tabIndex={nameModifiable ? "0" : "-1"}
                type="submit"
              >
                Apply change
              </button>
            </div>
          </form>

          <h1 className="text-center mb-2 p-0 gold">{email}</h1>

          <div className="m-auto mt-5 text-center">
            <img
              className="plant-image gold-border"
              src={plantImage}
              alt="Plant"
            ></img>
            <div
              className={showImageStatus ? "text-center mt-3" : "hidden-field"}
              style={{ color: "white" }}
            >
              <span>{imageStatus}</span>
            </div>
            <div
              className={
                plantImage !== container_no_image
                  ? "text-center mt-3"
                  : "hidden-field"
              }
            >
              <button
                className="btn btn-primary"
                tabIndex={plantImage !== container_no_image ? "0" : "-1"}
                onClick={deleteImage}
              >
                Delete image
              </button>
            </div>
          </div>

          <div className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}>
            <div
              className={showTokenStatus ? "text-center mt-1" : "hidden-field"}
            >
              <span style={{ color: "white" }}>{tokenStatus}</span>
            </div>
            <div className="text-center mt-2">
              <button
                className="btn btn-primary"
                onClick={regenerateArduinoToken}
              >
                Regenerate Arduino token
              </button>
            </div>
          </div>

          <h3 className="gold text-center mt-5">Sensor data</h3>
          <SensorPagination
            sensorReadings={sensorReadings}
            admin={true}
            wideView={wideView}
          ></SensorPagination>
        </>
      ) : (
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
          style={{ color: "white" }}
        >
          Loading plant...
        </div>
      )}
    </section>
  );
}
