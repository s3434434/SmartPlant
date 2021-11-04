import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./plant_admin.css";

export default function PlantAdmin(props) {
  const { getLogin } = props;
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;

  const [form, setForm] = useState({
      name: "",
      base64ImgString: "",
      plantID: window.location.pathname.substr(startIndex),
    }),
    [nameModifiable, setNameModifiable] = useState(false),
    [showNameStatus, setShowNameStatus] = useState(false),
    [nameStatus, setNameStatus] = useState("none"),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("none"),
    [plantType, setPlantType] = useState(""),
    [userID, setUserID] = useState(""),
    [plantImage, setPlantImage] = useState(container_background),
    [showTokenStatus, setShowTokenStatus] = useState(false),
    [tokenStatus, setTokenStatus] = useState("none"),
    [sensorReadings, setSensorReadings] = useState(null),
    [currentTimeframe, setCurrentTimeframe] = useState("All time"),
    [displayedReadings, setDisplayedReadings] = useState(
      "Loading sensor data..."
    ),
    [averageReading, setAverageReading] = useState(null),
    [currentPageNumber, setCurrentPageNumber] = useState(1),
    [paginationNumbers, setPaginationNumbers] = useState([]),
    [mobilePaginationNumbers, setMobilePaginationNumbers] = useState([]),
    [showDeleteStatus, setShowDeleteStatus] = useState(false),
    [deleteStatus, setDeleteStatus] = useState("none");

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
                setUserID(plant.userID);
              }
            });
          })
          .catch((err) => {
            window.location.pathname = "/";
          });

        axios
          .get(
            `https://smart-plant.azurewebsites.net/api/Admin/SensorData/${form.plantID}`,
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
        window.location.pathname = "/";
      }
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

    tempForm[input.name] = input.value;

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
        .put("https://smart-plant.azurewebsites.net/api/Admin/Plants", form, {
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

  const deleteImage = () => {
    setImageStatus("Please wait...");
    setShowImageStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .delete(
          `https://smart-plant.azurewebsites.net/api/Admin/Plants/Image?userID=${userID}&plantID=${form.plantID}`,
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

  const regenerateArduinoToken = () => {
    setTokenStatus("Please wait...");
    setShowTokenStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login,
        plantID = form.plantID;
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

  const getNumPages = (numReadings) => {
    let numPages = Math.floor(numReadings / 9);
    if (numReadings % 9 !== 0) {
      numPages++;
    }

    return numPages;
  };

  const createPaginationNumbers = (numReadings) => {
    const numPages = getNumPages(numReadings);

    let numbers = [...Array(numPages).keys()];
    numbers.forEach((number) => {
      numbers[number]++;
    });

    return numbers;
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
        const readingTime = new Date(
          sensorReading.timeStampUTC + "Z"
        ).getTime();
        if (readingTime <= now && readingTime >= endTime) {
          readings.push(sensorReading);
        }
      });
    }

    if (readings.length > 0) {
      let averageTemp = null,
        averageLightIntensity = null,
        averageMoisture = null,
        averageHumidity = null;
      readings.forEach((reading) => {
        averageTemp += reading.temp;
        averageLightIntensity += reading.lightIntensity;
        averageMoisture += reading.moisture;
        averageHumidity += reading.humidity;
      });
      averageTemp /= readings.length;
      averageLightIntensity /= readings.length;
      averageMoisture /= readings.length;
      averageHumidity /= readings.length;
      setAverageReading({
        temp: averageTemp,
        lightIntensity: averageLightIntensity,
        moisture: averageMoisture,
        humidity: averageHumidity,
      });

      setDisplayedReadings(readings);

      const numbers = createPaginationNumbers(readings.length);
      setPaginationNumbers(numbers.slice(0, 10));
      setMobilePaginationNumbers(numbers.slice(0, 5));

      setCurrentPageNumber(1);
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

    setCurrentTimeframe(timeframe);
  };

  const getDate = (isoDate) => {
    const date = new Date(isoDate + "Z");
    return date.toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  };

  const pageNavigate = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= getNumPages(displayedReadings.length)
    ) {
      const numbers = createPaginationNumbers(displayedReadings.length);

      if (pageNumber < paginationNumbers[0]) {
        const desktopNumbers = numbers.slice(pageNumber - 1, pageNumber + 9);

        if (desktopNumbers.length >= paginationNumbers.length) {
          setPaginationNumbers(desktopNumbers);
        }
      } else if (pageNumber > paginationNumbers[9]) {
        const desktopNumbers = numbers.slice(pageNumber - 10, pageNumber);

        if (desktopNumbers.length >= paginationNumbers.length) {
          setPaginationNumbers(desktopNumbers);
        }
      }

      if (pageNumber < mobilePaginationNumbers[0]) {
        const mobileNumbers = numbers.slice(pageNumber - 1, pageNumber + 4);

        if (mobileNumbers.length >= mobilePaginationNumbers.length) {
          setMobilePaginationNumbers(mobileNumbers);
        }
      } else if (pageNumber > mobilePaginationNumbers[4]) {
        const mobileNumbers = numbers.slice(pageNumber - 5, pageNumber);

        if (mobileNumbers.length >= mobilePaginationNumbers.length) {
          setMobilePaginationNumbers(mobileNumbers);
        }
      }
      setCurrentPageNumber(pageNumber);
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
          `https://smart-plant.azurewebsites.net/api/Admin/Plants?plantID=${form.plantID}`,
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
      <div className="d-none d-xl-block">
        <div className="container m-0 p-0">
          <div className="row">
            <div className="col-xl-2 text-center">
              <div className={showDeleteStatus ? "" : "hidden-field"}>
                <span style={{ color: "white" }}>{deleteStatus}</span>
              </div>
              <button className="btn btn-primary mt-2" onClick={deletePlant}>
                Delete plant
              </button>
            </div>
            <div className="col-xl-10"></div>
          </div>
        </div>
      </div>
      <div className="text-center d-xl-none">
        <div className={showDeleteStatus ? "text-center" : "hidden-field"}>
          <span style={{ color: "white" }}>{deleteStatus}</span>
        </div>
        <button className="btn btn-primary mt-2" onClick={deletePlant}>
          Delete plant
        </button>
      </div>
      <form
        className="w-25 m-auto d-none d-xl-block"
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
            <h4 className="text-center m-0 mb-4 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
            <h1 className="text-center m-0 p-0 gold">User ID:</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {userID}
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
            <h4 className="text-center m-0 mb-4 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
            <h1 className="text-center m-0 p-0 gold">User ID:</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {userID}
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
        className="m-auto px-2 d-xl-none"
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
            <h4 className="text-center m-0 mb-4 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
            <h1 className="text-center m-0 p-0 gold">User ID:</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {userID}
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
            <h4 className="text-center m-0 mb-4 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
            <h1 className="text-center m-0 p-0 gold">User ID:</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {userID}
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

      <div
        className="cg-container gold-border m-auto mt-1"
        style={{
          backgroundImage: `url(${plantImage})`,
        }}
      >
        {plantImage === container_background ? <h2>No current image</h2> : null}
      </div>
      <div
        className={showImageStatus ? "text-center mt-3" : "hidden-field"}
        style={{ color: "white" }}
      >
        <span>{imageStatus}</span>
      </div>
      <div
        className={
          plantImage !== container_background
            ? "text-center mt-3"
            : "hidden-field"
        }
      >
        <button className="btn btn-primary" onClick={deleteImage}>
          Delete image
        </button>
      </div>

      <div className="w-25 m-auto mt-4 d-none d-xl-block">
        <div className={showTokenStatus ? "text-center mt-1" : "hidden-field"}>
          <span style={{ color: "white" }}>{tokenStatus}</span>
        </div>
        <div className="text-center mt-2">
          <button className="btn btn-primary" onClick={regenerateArduinoToken}>
            Regenerate Arduino token
          </button>
        </div>
      </div>
      <div className="m-auto mt-4 px-2 d-xl-none">
        <div className={showTokenStatus ? "text-center mt-1" : "hidden-field"}>
          <span style={{ color: "white" }}>{tokenStatus}</span>
        </div>
        <div className="text-center mt-2">
          <button className="btn btn-primary" onClick={regenerateArduinoToken}>
            Regenerate Arduino token
          </button>
        </div>
      </div>

      <h3 className="gold text-center mt-5">Sensor data</h3>
      <div className="w-50 text-center m-auto d-none d-xl-block gold-border">
        {typeof displayedReadings === "string" ? (
          <span style={{ color: "white" }}>{displayedReadings}</span>
        ) : (
          <>
            <div className="overflow-auto">
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
                  {averageReading !== null ? (
                    <tr key="average">
                      <td>Average</td>
                      <td>{averageReading.temp.toFixed(1)} °C</td>
                      <td>{averageReading.lightIntensity.toFixed(1)}%</td>
                      <td>{averageReading.moisture.toFixed(1)}%</td>
                      <td>{averageReading.humidity.toFixed(1)}%</td>
                    </tr>
                  ) : null}
                  {displayedReadings
                    .slice(9 * (currentPageNumber - 1), 9 * currentPageNumber)
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
                  {9 -
                    displayedReadings.slice(
                      9 * (currentPageNumber - 1),
                      9 * currentPageNumber
                    ).length >
                  0
                    ? [
                        ...Array(
                          9 -
                            displayedReadings.slice(
                              9 * (currentPageNumber - 1),
                              9 * currentPageNumber
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
            <nav
              className="overflow-auto"
              style={{ backgroundColor: "transparent" }}
            >
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
                        className={
                          currentPageNumber === paginationNumber
                            ? "page-link page-link-selected"
                            : "page-link"
                        }
                        onClick={() => {
                          pageNavigate(paginationNumber);
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
        <nav
          className="mt-4 overflow-auto"
          style={{ backgroundColor: "transparent" }}
        >
          <h4 className="text-center gold">Sample timeframe</h4>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Hour"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Hour");
                }}
              >
                Hour
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Day"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Day");
                }}
              >
                Day
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Week"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Week");
                }}
              >
                Week
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Month"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Month");
                }}
              >
                Month
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Year"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Year");
                }}
              >
                Year
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "All time"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
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
            <div className="overflow-auto">
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
                  {averageReading !== null ? (
                    <tr key="average">
                      <td>Average</td>
                      <td>{averageReading.temp.toFixed(1)} °C</td>
                      <td>{averageReading.lightIntensity.toFixed(1)}%</td>
                      <td>{averageReading.moisture.toFixed(1)}%</td>
                      <td>{averageReading.humidity.toFixed(1)}%</td>
                    </tr>
                  ) : null}
                  {displayedReadings
                    .slice(9 * (currentPageNumber - 1), 9 * currentPageNumber)
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
                  {9 -
                    displayedReadings.slice(
                      9 * (currentPageNumber - 1),
                      9 * currentPageNumber
                    ).length >
                  0
                    ? [
                        ...Array(
                          9 -
                            displayedReadings.slice(
                              9 * (currentPageNumber - 1),
                              9 * currentPageNumber
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
            <nav
              className="overflow-auto"
              style={{ backgroundColor: "transparent" }}
            >
              <ul className="pagination pagination-sm justify-content-center">
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
                {mobilePaginationNumbers.map((mobilePaginationNumber) => {
                  return (
                    <li className="page-item" key={mobilePaginationNumber}>
                      <span
                        className={
                          currentPageNumber === mobilePaginationNumber
                            ? "page-link page-link-selected"
                            : "page-link"
                        }
                        onClick={() => {
                          pageNavigate(mobilePaginationNumber);
                        }}
                      >
                        {mobilePaginationNumber}
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
        <nav
          className="mt-4 overflow-auto"
          style={{ backgroundColor: "transparent" }}
        >
          <h4 className="text-center gold">Sample timeframe</h4>
          <ul className="pagination pagination-sm justify-content-center">
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Hour"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Hour");
                }}
              >
                Hour
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Day"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Day");
                }}
              >
                Day
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Week"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Week");
                }}
              >
                Week
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Month"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Month");
                }}
              >
                Month
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "Year"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
                onClick={() => {
                  updateDisplayedReadings("Year");
                }}
              >
                Year
              </span>
            </li>
            <li className="page-item">
              <span
                className={
                  currentTimeframe === "All time"
                    ? "page-link page-link-selected"
                    : "page-link"
                }
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
