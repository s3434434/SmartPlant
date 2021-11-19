import React, { useEffect, useState } from "react";
import "./sensor_pagination.css";

export default function SensorPagination(props) {
  const { sensorReadings, admin, wideView } = props;

  const [currentTimeframe, setCurrentTimeframe] = useState("All time"),
    [displayedReadings, setDisplayedReadings] = useState(
      "Loading sensor data..."
    ),
    [averageReading, setAverageReading] = useState(null),
    [currentPageNumber, setCurrentPageNumber] = useState(1),
    [paginationNumbers, setPaginationNumbers] = useState([]),
    [mobilePaginationNumbers, setMobilePaginationNumbers] = useState([]);

  useEffect(() => {
    if (sensorReadings !== null) {
      if (typeof sensorReadings !== "string") {
        updateDisplayedReadings("All time");
      } else {
        setDisplayedReadings(sensorReadings);
      }
    }
    // eslint-disable-next-line
  }, [sensorReadings]);

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
        if (admin) {
          setDisplayedReadings("No sensor data available.");
        } else {
          setDisplayedReadings(
            "No sensor data available. Please make sure you have correctly input your token into the Arduino."
          );
        }
      } else {
        if (admin) {
          setDisplayedReadings(
            "No sensor data available. The sensors may not have collected enough data for this timeframe."
          );
        } else {
          setDisplayedReadings(
            "No sensor data available. Your sensors may not have collected enough data for this timeframe. Otherwise, please make sure you have correctly input your token into the Arduino."
          );
        }
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

  return (
    <div
      className={
        wideView
          ? "w-50 text-center m-auto gold-border"
          : "m-auto text-center px-2 mb-2 gold-border"
      }
    >
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
            <ul
              className={
                wideView
                  ? "pagination justify-content-center"
                  : "pagination pagination-sm justify-content-center"
              }
            >
              <li className="page-item">
                <span
                  className="page-link"
                  tabIndex="0"
                  onClick={() => {
                    pageNavigate(currentPageNumber - 1);
                  }}
                  onKeyPress={() => {
                    pageNavigate(currentPageNumber - 1);
                  }}
                >
                  Previous
                </span>
              </li>
              {wideView
                ? paginationNumbers.map((paginationNumber) => {
                    return (
                      <li className="page-item" key={paginationNumber}>
                        <span
                          className={
                            currentPageNumber === paginationNumber
                              ? "page-link page-link-selected"
                              : "page-link"
                          }
                          tabIndex="0"
                          onClick={() => {
                            pageNavigate(paginationNumber);
                          }}
                          onKeyPress={() => {
                            pageNavigate(paginationNumber);
                          }}
                        >
                          {paginationNumber}
                        </span>
                      </li>
                    );
                  })
                : mobilePaginationNumbers.map((mobilePaginationNumber) => {
                    return (
                      <li className="page-item" key={mobilePaginationNumber}>
                        <span
                          className={
                            currentPageNumber === mobilePaginationNumber
                              ? "page-link page-link-selected"
                              : "page-link"
                          }
                          tabIndex="0"
                          onClick={() => {
                            pageNavigate(mobilePaginationNumber);
                          }}
                          onKeyPress={() => {
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
                  tabIndex="0"
                  onClick={() => {
                    pageNavigate(currentPageNumber + 1);
                  }}
                  onKeyPress={() => {
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
        <ul
          className={
            wideView
              ? "pagination justify-content-center"
              : "pagination pagination-sm justify-content-center"
          }
        >
          <li className="page-item">
            <span
              className={
                currentTimeframe === "Hour"
                  ? "page-link page-link-selected"
                  : "page-link"
              }
              tabIndex="0"
              onClick={() => {
                updateDisplayedReadings("Hour");
              }}
              onKeyPress={() => {
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
              tabIndex="0"
              onClick={() => {
                updateDisplayedReadings("Day");
              }}
              onKeyPress={() => {
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
              tabIndex="0"
              onClick={() => {
                updateDisplayedReadings("Week");
              }}
              onKeyPress={() => {
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
              tabIndex="0"
              onClick={() => {
                updateDisplayedReadings("Month");
              }}
              onKeyPress={() => {
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
              tabIndex="0"
              onClick={() => {
                updateDisplayedReadings("Year");
              }}
              onKeyPress={() => {
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
              tabIndex="0"
              onClick={() => {
                updateDisplayedReadings("All time");
              }}
              onKeyPress={() => {
                updateDisplayedReadings("All time");
              }}
            >
              All time
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
}
