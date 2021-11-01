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
    [sensorReadings, setSensorReadings] = useState(null),
    [displayedReadings, setDisplayedReadings] = useState(
      "Loading sensor data..."
    ),
    [currentPageNumber, setCurrentPageNumber] = useState(0),
    [paginationNumbers, setPaginationNumbers] = useState([]);

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

      loadSensorReadings();
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (sensorReadings !== null) {
      updateDisplayedReadings("All time");
    }
    // eslint-disable-next-line
  }, [sensorReadings]);

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

  const getNumPages = (numReadings) => {
    let numPages = Math.floor(numReadings / 10);
    if (numReadings % 10 !== 0) {
      numPages++;
    }

    return numPages;
  };

  const getPaginationNumbers = (numReadings) => {
    const numPages = getNumPages(numReadings);

    let numbers = [...Array(numPages).keys()];
    numbers.forEach((number) => {
      numbers[number]++;
    });

    return numbers;
  };

  const loadSensorReadings = () => {
    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

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
          setDisplayedReadings(
            "There was an error retrieving your sensor data. Please try again later."
          );
        });
    } else {
      setDisplayedReadings("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
  };

  const updateDisplayedReadings = (timeframe) => {
    let readings = [];
    if (timeframe === "All time") {
      readings = sensorReadings;
    } else {
      const now = new Date().getTime();

      let endTime = null;
      switch (timeframe) {
        case "Hour":
          endTime = now - 3600000;
          break;
        case "Day":
          endTime = now - 86400000;
          break;
        case "Week":
          endTime = now - 604800000;
          break;
        case "Month":
          endTime = new Date();
          const currentMonth = endTime.getMonth();
          endTime.setMonth(endTime.getMonth() - 1);
          if (endTime.getMonth() === currentMonth) {
            endTime.setDate(0);
          }
          endTime = endTime.getTime();

          break;
        case "Year":
          endTime = new Date();
          const current_month = endTime.getMonth();
          endTime.setMonth(endTime.getMonth() - 12);
          if (endTime.getMonth() === current_month) {
            endTime.setDate(0);
          }
          endTime = endTime.getTime();

          break;
        default:
          break;
      }

      sensorReadings.forEach((sensorReading) => {
        const readingTime = new Date(sensorReading.timeStampUTC).getTime();
        if (readingTime <= now && readingTime >= endTime) {
          readings.push(sensorReading);
        }
      });
    }

    if (readings.length > 0) {
      setDisplayedReadings(readings);

      const numbers = getPaginationNumbers(readings.length);
      setPaginationNumbers(numbers.slice(0, 19));

      setCurrentPageNumber(0);
    } else {
      if (timeframe === "All time") {
        setDisplayedReadings(
          "No sensor data available. Please make sure you have correctly input your token into the Arduino."
        );
      } else {
        setDisplayedReadings(
          "No sensor data available. Your sensors may not have collected enough data for this timeframe. Otherwise, please make sure you have correctly input your token into the Arduino."
        );
      }
    }
  };

  const getDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  };

  const pageNavigate = (pageNumber) => {
    if (
      pageNumber >= 0 &&
      pageNumber <= getNumPages(displayedReadings.length) - 1
    ) {
      let numbers = getPaginationNumbers(displayedReadings.length);
      numbers = numbers.slice(pageNumber, pageNumber + 19);

      if (numbers.length >= paginationNumbers.length) {
        setPaginationNumbers(numbers);
      }
      setCurrentPageNumber(pageNumber);
    }
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
            <h3 className="gold text-center mt-1">Arduino token</h3>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{arduinoToken}</span>
            </div>
          </div>
          <div className="m-auto px-2 d-lg-none">
            <h3 className="gold text-center mt-1">Arduino token</h3>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{arduinoToken}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-25 m-auto d-none d-lg-block">
            <div
              className={showTokenStatus ? "text-center mt-1" : "hidden-field"}
            >
              <span style={{ color: "white" }}>{tokenStatus}</span>
            </div>
            <div className="text-center mt-2">
              <button className="btn btn-primary" onClick={fetchArduinoToken}>
                Show Arduino token
              </button>
            </div>
          </div>
          <div className="m-auto px-2 d-lg-none">
            <div
              className={showTokenStatus ? "text-center mt-1" : "hidden-field"}
            >
              <span style={{ color: "white" }}>{tokenStatus}</span>
            </div>
            <div className="text-center mt-2">
              <button className="btn btn-primary" onClick={fetchArduinoToken}>
                Show Arduino token
              </button>
            </div>
          </div>
        </>
      )}

      <h3 className="gold text-center mt-5">Sensor data</h3>
      <div className="w-50 text-center m-auto d-none d-xl-block gold-border">
        {typeof displayedReadings === "string" ? (
          <span style={{ color: "white" }}>{displayedReadings}</span>
        ) : (
          <>
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Temperature</th>
                    <th>Light intensity</th>
                    <th>Moisture</th>
                    <th>Humidity</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedReadings
                    .slice(10 * currentPageNumber, currentPageNumber + 10)
                    .map((row) => {
                      return (
                        <tr key={row.timeStampUTC}>
                          <td>{getDate(row.timeStampUTC)}</td>
                          <td>{row.temp.toFixed(1)} °C</td>
                          <td>{row.lightIntensity.toFixed(1)}%</td>
                          <td>{row.moisture.toFixed(1)}%</td>
                          <td>{row.humidity.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  {10 -
                    displayedReadings.slice(
                      10 * currentPageNumber,
                      currentPageNumber + 10
                    ).length >
                  0
                    ? [
                        ...Array(
                          10 -
                            displayedReadings.slice(
                              10 * currentPageNumber,
                              currentPageNumber + 10
                            ).length
                        ).keys(),
                      ].map((key) => {
                        return (
                          <tr key={key}>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
            <nav style={{ backgroundColor: "transparent" }}>
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <span
                    className="page-link"
                    onClick={() => {
                      pageNavigate(currentPageNumber - 1);
                    }}
                  >
                    Previous
                  </span>
                </li>
                {paginationNumbers.map((paginationNumber) => {
                  return (
                    <li className="page-item" key={paginationNumber}>
                      <span
                        className="page-link"
                        onClick={() => {
                          pageNavigate(paginationNumber - 1);
                        }}
                      >
                        {paginationNumber}
                      </span>
                    </li>
                  );
                })}
                <li className="page-item">
                  <span
                    className="page-link"
                    onClick={() => {
                      pageNavigate(currentPageNumber + 1);
                    }}
                  >
                    Next
                  </span>
                </li>
              </ul>
            </nav>
          </>
        )}
        <nav className="mt-4" style={{ backgroundColor: "transparent" }}>
          <h4 className="text-center gold">Sample timeframe</h4>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Hour");
                }}
              >
                Hour
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Day");
                }}
              >
                Day
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Week");
                }}
              >
                Week
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Month");
                }}
              >
                Month
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Year");
                }}
              >
                Year
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("All time");
                }}
              >
                All time
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="m-auto px-2 d-xl-none gold-border">
        {typeof displayedReadings === "string" ? (
          <span style={{ color: "white" }}>{displayedReadings}</span>
        ) : (
          <>
            <div className="overflow-scroll">
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Temperature</th>
                    <th>Light intensity</th>
                    <th>Moisture</th>
                    <th>Humidity</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedReadings
                    .slice(10 * currentPageNumber, currentPageNumber + 10)
                    .map((row) => {
                      return (
                        <tr key={row.timeStampUTC}>
                          <td>{getDate(row.timeStampUTC)}</td>
                          <td>{row.temp.toFixed(1)} °C</td>
                          <td>{row.lightIntensity.toFixed(1)}%</td>
                          <td>{row.moisture.toFixed(1)}%</td>
                          <td>{row.humidity.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  {10 -
                    displayedReadings.slice(
                      10 * currentPageNumber,
                      currentPageNumber + 10
                    ).length >
                  0
                    ? [
                        ...Array(
                          10 -
                            displayedReadings.slice(
                              10 * currentPageNumber,
                              currentPageNumber + 10
                            ).length
                        ).keys(),
                      ].map((key) => {
                        return (
                          <tr key={key}>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                            <td className="hidden-field">-</td>
                          </tr>
                        );
                      })
                    : null}
                </tbody>
              </table>
            </div>
            <nav style={{ backgroundColor: "transparent" }}>
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <span
                    className="page-link"
                    onClick={() => {
                      pageNavigate(currentPageNumber - 1);
                    }}
                  >
                    Previous
                  </span>
                </li>
                {paginationNumbers.map((paginationNumber) => {
                  return (
                    <li className="page-item" key={paginationNumber}>
                      <span
                        className="page-link"
                        onClick={() => {
                          pageNavigate(paginationNumber - 1);
                        }}
                      >
                        {paginationNumber}
                      </span>
                    </li>
                  );
                })}
                <li className="page-item">
                  <span
                    className="page-link"
                    onClick={() => {
                      pageNavigate(currentPageNumber + 1);
                    }}
                  >
                    Next
                  </span>
                </li>
              </ul>
            </nav>
          </>
        )}
        <nav className="mt-4" style={{ backgroundColor: "transparent" }}>
          <h4 className="text-center gold">Sample timeframe</h4>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Hour");
                }}
              >
                Hour
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Day");
                }}
              >
                Day
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Week");
                }}
              >
                Week
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Month");
                }}
              >
                Month
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("Year");
                }}
              >
                Year
              </span>
            </li>
            <li className="page-item">
              <span
                className="page-link"
                onClick={() => {
                  updateDisplayedReadings("All time");
                }}
              >
                All time
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}
