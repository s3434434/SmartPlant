import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./plant.css";

export default function Plant(props) {
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;
  const [form, setForm] = useState({
      name: "",
      base64ImgString: "",
      plantID: window.location.pathname.substr(startIndex),
    }),
    [nameModifiable, setNameModifiable] = useState(false),
    [imageModifiable, setImageModifiable] = useState(false),
    [showNameStatus, setShowNameStatus] = useState(false),
    [nameStatus, setNameStatus] = useState("none"),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("none"),
    [plantType, setPlantType] = useState(""),
    [plantImage, setPlantImage] = useState(container_background),
    [arduinoToken, setArduinoToken] = useState(""),
    [showArduinoToken, setShowArduinoToken] = useState(false),
    [showTokenStatus, setShowTokenStatus] = useState(false),
    [tokenStatus, setTokenStatus] = useState("none"),
    [currentPageNumber, setCurrentPageNumber] = useState(1),
    [paginationNumbers, setPaginationNumbers] = useState([]),
    [currentPage, setCurrentPage] = useState("Loading sensor data...");

  useEffect(() => {
    document.title = "Demeter - The plant meter";

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

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

              if (plant.imgurURL !== null) {
                setPlantImage(plant.imgurURL);
              }
              setPlantType(plant.plantType);
            }
          });
        })
        .catch((err) => {
          props.logOut();
          window.location.pathname = "/";
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

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

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

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);
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

  const loadSensorData = (frequency) => {
    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

      let path = "";
      if (frequency === "Daily" || frequency === "Monthly") {
        path = frequency;
        path += "/";
      }
      axios
        .get(
          `https://smart-plant.azurewebsites.net/api/SensorData/${path}${form.plantID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          const rows = res.data;

          if (rows.length > 0) {
            setCurrentPage(rows);

            let numbers = [...rows.keys()];
            numbers.forEach((number) => {
              numbers[number]++;
            });

            setPaginationNumbers(numbers.slice(0, 19));
          } else {
            if (frequency === "15 min") {
              setCurrentPage(
                "No sensor data available. Please make sure you have correctly input your token into the Arduino."
              );
            } else {
              setCurrentPage(
                "No sensor data available. Your sensors may not have collected enough data for this timeframe. Otherwise, please make sure you have correctly input your token into the Arduino."
              );
            }

            setPaginationNumbers([]);
          }
        })
        .catch((err) => {
          setCurrentPage("Server error. Please try again later.");
        });
    } else {
      setCurrentPage("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  const pageNavigate = (pageNumber) => {
    setCurrentPageNumber(pageNumber);
  };

  return (
    <section>
      <form
        className="w-25 m-auto d-none d-lg-block"
        onSubmit={(e) => {
          handleSubmit(e, setNameStatus, setShowNameStatus);
        }}
      >
        {nameModifiable ? (
          <>
            <label className="form-label gold" htmlFor="name">
              Name
            </label>
            <input
              className="form-control mb-3"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        ) : (
          <>
            <div className="text-end m-0 p-0">
              <FontAwesomeIcon
                className="gold light-gold-hover"
                icon={faPen}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setNameModifiable(true);
                }}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-center gold m-0 mb-2 p-0">{form.name}</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        )}
        <div className={showNameStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{nameStatus}</span>
        </div>
        <div className={nameModifiable ? "text-center my-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form
        className="m-auto px-2 d-lg-none"
        onSubmit={(e) => {
          handleSubmit(e, setNameStatus, setShowNameStatus);
        }}
      >
        {nameModifiable ? (
          <>
            <label className="form-label gold" htmlFor="name">
              Name
            </label>
            <input
              className="form-control mb-3"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        ) : (
          <>
            <div className="text-end m-0 p-0">
              <FontAwesomeIcon
                className="gold light-gold-hover"
                icon={faPen}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setNameModifiable(true);
                }}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-center gold m-0 mb-2 p-0">{form.name}</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        )}
        <div className={showNameStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{nameStatus}</span>
        </div>
        <div className={nameModifiable ? "text-center my-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto d-none d-lg-block"
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
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10"></div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setImageModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div
              className="cg-container gold-border m-auto mt-1"
              style={{
                backgroundImage: `url(${plantImage})`,
              }}
            >
              {plantImage === container_background ? (
                <h2>No current image</h2>
              ) : null}
            </div>
          </>
        )}
        <div className={showImageStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{imageStatus}</span>
        </div>
        <div className={imageModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-lg-none"
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
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10"></div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setImageModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div
              className="cg-container gold-border m-auto mt-1"
              style={{
                backgroundImage: `url(${plantImage})`,
              }}
            >
              {plantImage === container_background ? (
                <h2>No current image</h2>
              ) : null}
            </div>
          </>
        )}
        <div className={showImageStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{imageStatus}</span>
        </div>
        <div className={imageModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>

      {showArduinoToken ? (
        <>
          <div className="w-25 m-auto d-none d-lg-block">
            <div className="gold">
              <span>Arduino token</span>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{arduinoToken}</span>
            </div>
          </div>
          <div className="m-auto px-2 d-lg-none">
            <div className="gold">
              <span>Arduino token</span>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{arduinoToken}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-25 m-auto d-none d-lg-block">
            <div
              className={showTokenStatus ? "text-center mt-3" : "hidden-field"}
            >
              <span style={{ color: "white" }}>{tokenStatus}</span>
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={fetchArduinoToken}>
                Show Arduino token
              </button>
            </div>
          </div>
          <div className="m-auto px-2 d-lg-none">
            <div
              className={showTokenStatus ? "text-center mt-3" : "hidden-field"}
            >
              <span style={{ color: "white" }}>{tokenStatus}</span>
            </div>
            <div className="text-center mt-3">
              <button className="btn btn-primary" onClick={fetchArduinoToken}>
                Show Arduino token
              </button>
            </div>
          </div>
        </>
      )}

      <div className="w-25 m-auto d-none d-lg-block gold-border">
        {currentPage instanceof String ? (
          <span className="text-center" style={{ color: "white" }}>
            {currentPage}
          </span>
        ) : (
          <>
            <table>
              <th>
                <td>Light intensity</td>
                <td>Temperature</td>
                <td>Humidity</td>
                <td>Moisture</td>
                <td>Time</td>
              </th>
              {currentPage
                .slice(currentPageNumber - 1, currentPageNumber + 8)
                .map((row) => {
                  return (
                    <tr>
                      <td>{row.lightIntensity}</td>
                      <td>{row.temp}</td>
                      <td>{row.humidity}</td>
                      <td>{row.moisture}</td>
                      <td>{row.timeStampUTC}</td>
                    </tr>
                  );
                })}
            </table>
            <nav>
              <h5 className="text-center" style={{ color: "white" }}>
                Sample frequency
              </h5>
              <ul className="pagination">
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      loadSensorData("15 min");
                    }}
                  >
                    15 minute
                  </a>
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      loadSensorData("Daily");
                    }}
                  >
                    Daily
                  </a>
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      loadSensorData("Monthly");
                    }}
                  >
                    Monthly
                  </a>
                </li>
              </ul>
            </nav>
            <nav>
              <ul className="pagination">
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      pageNavigate(currentPageNumber - 1);
                    }}
                  >
                    Previous
                  </a>
                </li>
                {paginationNumbers.map((paginationNumber) => {
                  return (
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={() => {
                          pageNavigate(paginationNumber);
                        }}
                      >
                        {paginationNumber}
                      </a>
                    </li>
                  );
                })}
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      pageNavigate(currentPageNumber + 1);
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
      <div className="m-auto px-2 d-lg-none gold-border">
        {currentPage instanceof String ? (
          <span className="text-center" style={{ color: "white" }}>
            {currentPage}
          </span>
        ) : (
          <>
            <table>
              <th>
                <td>Light intensity</td>
                <td>Temperature</td>
                <td>Humidity</td>
                <td>Moisture</td>
                <td>Time</td>
              </th>
              {currentPage
                .slice(currentPageNumber - 1, currentPageNumber + 8)
                .map((row) => {
                  return (
                    <tr>
                      <td>{row.lightIntensity}</td>
                      <td>{row.temp}</td>
                      <td>{row.humidity}</td>
                      <td>{row.moisture}</td>
                      <td>{row.timeStampUTC}</td>
                    </tr>
                  );
                })}
            </table>
            <nav>
              <h5 className="text-center" style={{ color: "white" }}>
                Sample frequency
              </h5>
              <ul className="pagination">
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      loadSensorData("15 min");
                    }}
                  >
                    15 minute
                  </a>
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      loadSensorData("Daily");
                    }}
                  >
                    Daily
                  </a>
                </li>
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      loadSensorData("Monthly");
                    }}
                  >
                    Monthly
                  </a>
                </li>
              </ul>
            </nav>
            <nav>
              <ul className="pagination">
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      pageNavigate(currentPageNumber - 1);
                    }}
                  >
                    Previous
                  </a>
                </li>
                {paginationNumbers.map((paginationNumber) => {
                  return (
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={() => {
                          pageNavigate(paginationNumber);
                        }}
                      >
                        {paginationNumber}
                      </a>
                    </li>
                  );
                })}
                <li class="page-item">
                  <a
                    class="page-link"
                    href="#"
                    onClick={() => {
                      pageNavigate(currentPageNumber + 1);
                    }}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>
    </section>
  );
}
