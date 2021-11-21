import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import container_no_image from "../../assets/images/container_no_image.png";
import SensorPagination from "../sensor_pagination/sensor_pagination";
import "./plant.css";

export default function Plant(props) {
  const { getLogin, wideView } = props;

  // Constant for the plant ID from the URL path.
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;
  const plantID = window.location.pathname.substr(startIndex);

  // Constant for a file reader used for the upload of image files. The FileReader's onload function is set to parse the file into base 64, then update the base64ImgString of the form state variable.
  const fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    const tempForm = _.cloneDeep(form);

    let base64_img_string = fileLoadedEvent.target.result;
    const startIndex = base64_img_string.indexOf(",") + 1;
    base64_img_string = base64_img_string.substr(startIndex);
    tempForm.base64ImgString = base64_img_string;

    setForm(tempForm);
  };

  // State variables for the plant details form, whether or not the fields of this form are modifiable, the statuses of these fields' associated requests, and whether these statuses are being shown.
  //State variables are also created for the plant type, plant image, Arduino token, Arduino token loading status and whether that status is being shown, sensor data readings, and plant delete status and whether that status is being shown.
  const [form, setForm] = useState({
      name: "",
      base64ImgString: "",
    }),
    [nameModifiable, setNameModifiable] = useState(false),
    [imageModifiable, setImageModifiable] = useState(false),
    [showNameStatus, setShowNameStatus] = useState(false),
    [nameStatus, setNameStatus] = useState("-"),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("-"),
    [plantType, setPlantType] = useState(""),
    [plantImage, setPlantImage] = useState(null),
    [arduinoToken, setArduinoToken] = useState(""),
    [showArduinoToken, setShowArduinoToken] = useState(false),
    [showTokenStatus, setShowTokenStatus] = useState(false),
    [tokenStatus, setTokenStatus] = useState("-"),
    [sensorReadings, setSensorReadings] = useState(null),
    [showDeleteStatus, setShowDeleteStatus] = useState(false),
    [deleteStatus, setDeleteStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in on the UI. If not, the user is returned to the root path.
  // Otherwise, two GET requests are made - one to the backend Plants endpoint and one to the backend SensorData endpoint.

  // The GET request to the Plants endpoint proceeds as follows:
  // If the request is unsuccessful, the user is returned to the root path Otherwise, the response array is iterated through to find a plant with a matching plant ID. If no such plant is found, the user is returned to the root path.
  // Otherwise, the title of the web page is updated appropriately, the 'name' field of the form state variable is set to the plant's name, the plantImage state variable is set to either the found plant's image or a default one depending if it exists, and the plantType state variable is set to the plant's type.

  // The GET request to the SensorData endpoint proceeds as follows:
  // If the request is unsuccessful, an appropriate error message is shown in the sensor data table. Otherwise, the sensor readings response data array is sorted according to the timestamp of each reading, then the array is assigned to the sensorReadings state variable.
  useEffect(() => {
    document.title = "Demeter - The plant meter";

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .get("https://smart-plant.azurewebsites.net/api/Plants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let plantFound = false;

          res.data.forEach((plant) => {
            if (plant.plantID === plantID) {
              document.title = `${plant.name} | Demeter - The plant meter`;

              let tempForm = _.cloneDeep(form);
              tempForm.name = plant.name;
              setForm(tempForm);

              let image = container_no_image;
              if (plant.imgurURL !== null) {
                image = plant.imgurURL;
              }
              setPlantImage(image);

              setPlantType(plant.plantType);

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
          `https://smart-plant.azurewebsites.net/api/SensorData/${plantID}`,
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
            "There was an error retrieving your sensor data. Please try again later."
          );
        });
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  // Updates the form state variable with the appropriate input field whenever a form input field is updated. If the input field is the file upload input for the image, the FileReader's readAsDataURL function is called.
  const handleChange = (e) => {
    const input = e.target;

    if (input.name === "base64ImgString") {
      fileReader.readAsDataURL(input.files[0]);
    } else {
      const tempForm = _.cloneDeep(form);
      tempForm[input.name] = input.value;

      setForm(tempForm);
    }
  };

  // Handles the submit event of the plant details form. This is called whenever a field of this page is edited and updated. In addition to the event parameter, the status and setStatus state variables of the field in question are passed in, allowing this function to be used in multiple parts of the page.
  // The status parameter is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a PUT request is made to the backend update plant endpoint using the plant details form state variable and the plant ID from the URL path. If this request is successful, the page is reloaded. Otherwise, an appropriate error message is shown.
  const handleSubmit = (e, setStatus, setShowStatus) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      const formData = _.cloneDeep(form);
      formData.plantID = plantID;

      axios
        .put("https://smart-plant.azurewebsites.net/api/Plants", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          const errors = err.response.data.messages;
          let errorMessage = "Server error. Please try again later.";

          if (errors.PlantName !== undefined) {
            errorMessage = errors.PlantName[0];
          } else if (errors["Name Taken"] !== undefined) {
            errorMessage = errors["Name Taken"][0];
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

  // Fetches the Arduino token from the backend and shows it to the user. The Arduino token status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a GET request is made to the plant token endpoint.  If this request is successful, the arduinoToken state variable is updated and shown. Otherwise, an appropriate error message is shown.
  const fetchArduinoToken = () => {
    setTokenStatus("Please wait...");
    setShowTokenStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .get(
          `https://smart-plant.azurewebsites.net/api/Plants/Token/${plantID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setArduinoToken(res.data);
          setShowArduinoToken(true);
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
  // Otherwise, a DELETE request is made to the backend delete plant endpoint.  If this request is successful, the user is navigated to the root path. Otherwise, an appropriate error message is shown.
  const deletePlant = () => {
    setDeleteStatus("Please wait...");
    setShowDeleteStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .delete(
          `https://smart-plant.azurewebsites.net/api/Plants?plantID=${plantID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          window.location.pathname = "/";
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
            onSubmit={(e) => {
              handleSubmit(e, setNameStatus, setShowNameStatus);
            }}
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
                    value={form.name}
                    onChange={handleChange}
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
                <h1 className="text-center gold m-0 mb-2 p-0">{form.name}</h1>
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

          <form
            className={wideView ? "w-25 m-auto" : "m-auto mt-5 px-2"}
            onSubmit={(e) => {
              handleSubmit(e, setImageStatus, setShowImageStatus);
            }}
          >
            {imageModifiable ? (
              <>
                <label className="form-label gold" htmlFor="base64ImgString">
                  Image
                </label>
                <input
                  className="form-control"
                  name="base64ImgString"
                  type="file"
                  required
                  onChange={handleChange}
                />
              </>
            ) : (
              <div className="text-center">
                <div className="container p-0">
                  <div className="row">
                    <div className="col-sm-10"></div>
                    <div className="col-sm-2 text-end">
                      <FontAwesomeIcon
                        className="gold light-gold-hover"
                        tabIndex="0"
                        icon={faPen}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setImageModifiable(true);
                        }}
                        onKeyPress={() => {
                          setImageModifiable(true);
                        }}
                      ></FontAwesomeIcon>
                    </div>
                  </div>
                </div>
                <img
                  className="plant-image gold-border m-auto mt-1"
                  src={plantImage}
                  alt="Plant"
                ></img>
              </div>
            )}
            <div
              className={showImageStatus ? "text-center mt-3" : "hidden-field"}
            >
              <span>{imageStatus}</span>
            </div>
            <div
              className={
                imageModifiable ? "text-center mt-3 mb-1" : "hidden-field"
              }
            >
              <button
                className="btn btn-primary"
                tabIndex={imageModifiable ? "0" : "-1"}
                type="submit"
              >
                Apply change
              </button>
            </div>
          </form>

          {showArduinoToken ? (
            <div className={wideView ? "w-25 m-auto" : "m-auto px-2"}>
              <h3 className="gold text-center mt-1">Arduino token</h3>
              <div className="mt-1 py-1 overflow-hidden gold-border">
                <span className="ms-1">{arduinoToken}</span>
              </div>
            </div>
          ) : (
            <div className={wideView ? "w-25 m-auto" : "m-auto px-2"}>
              <div
                className={
                  showTokenStatus ? "text-center mt-1" : "hidden-field"
                }
              >
                <span style={{ color: "white" }}>{tokenStatus}</span>
              </div>
              <div className="text-center mt-2">
                <button className="btn btn-primary" onClick={fetchArduinoToken}>
                  Show Arduino token
                </button>
              </div>
            </div>
          )}

          <h3 className="gold text-center mt-5">Sensor data</h3>
          <SensorPagination
            sensorReadings={sensorReadings}
            admin={false}
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
