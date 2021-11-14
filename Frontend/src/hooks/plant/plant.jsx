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
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;

  const [form, setForm] = useState({
      name: "",
      base64ImgString: "",
      plantID: window.location.pathname.substr(startIndex),
    }),
    [nameModifiable, setNameModifiable] = useState(false),
    [imageModifiable, setImageModifiable] = useState(false),
    [showNameStatus, setShowNameStatus] = useState(false),
    [nameStatus, setNameStatus] = useState("-"),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("-"),
    [plantType, setPlantType] = useState("-"),
    [plantImage, setPlantImage] = useState(null),
    [arduinoToken, setArduinoToken] = useState("-"),
    [showArduinoToken, setShowArduinoToken] = useState(false),
    [showTokenStatus, setShowTokenStatus] = useState(false),
    [tokenStatus, setTokenStatus] = useState("-"),
    [sensorReadings, setSensorReadings] = useState(null),
    [showDeleteStatus, setShowDeleteStatus] = useState(false),
    [deleteStatus, setDeleteStatus] = useState("-");

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
          res.data.forEach((plant) => {
            if (plant.plantID === form.plantID) {
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
            }
          });
        })
        .catch((err) => {
          window.location.pathname = "/";
        });

      axios
        .get(
          `https://smart-plant.azurewebsites.net/api/SensorData/${form.plantID}`,
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

  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);

    if (input.name === "base64ImgString") {
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        let base64 = fileLoadedEvent.target.result;
        const startIndex = base64.indexOf(",") + 1;
        base64 = base64.substr(startIndex);

        tempForm[input.name] = base64;
      };

      fileReader.readAsDataURL(input.files[0]);
    } else {
      tempForm[input.name] = input.value;
    }

    setForm(tempForm);
  };

  const handleSubmit = (e, setStatus, setShowStatus) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .put("https://smart-plant.azurewebsites.net/api/Plants", form, {
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

  const fetchArduinoToken = () => {
    setTokenStatus("Please wait...");
    setShowTokenStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .get(
          `https://smart-plant.azurewebsites.net/api/Plants/Token/${form.plantID}`,
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

  const deletePlant = () => {
    setDeleteStatus("Please wait...");
    setShowDeleteStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .delete(
          `https://smart-plant.azurewebsites.net/api/Plants?plantID=${form.plantID}`,
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
              <button className="btn btn-primary mt-2" onClick={deletePlant}>
                Delete plant
              </button>
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
        <div className="text-center" style={{ color: "white" }}>
          Loading plant...
        </div>
      )}
    </section>
  );
}
