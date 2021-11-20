import React, { useEffect, useState } from "react";
import "./sensor_pagination.css";

export default function SensorPagination(props) {
  const { sensorReadings, admin, wideView } = props;

  // Constants for the number of items per page, and the maximum number of desktop and mobile pagination numbers showing at any one time. The items per page is set to 9 to account for the 'average' row at the top of each page.
  const ITEMS_PER_PAGE = 9,
    MAX_DESKTOP_PAGINATION_NUMBERS = 10,
    MAX_MOBILE_PAGINATION_NUMBERS = 5;

  // State variables for the current timeframe, the sensor readings in the current timeframe, all pagination numbers, the current pagination numbers for desktop and mobile, and the current page number.
  const [currentTimeframe, setCurrentTimeframe] = useState("All time"),
    [timeframeReadings, setTimeframeReadings] = useState(
      "Loading sensor data..."
    ),
    [averageReading, setAverageReading] = useState(null),
    [allPaginationNumbers, setAllPaginationNumbers] = useState([]),
    [desktopPaginationNumbers, setDesktopPaginationNumbers] = useState([]),
    [mobilePaginationNumbers, setMobilePaginationNumbers] = useState([]),
    [currentPageNumber, setCurrentPageNumber] = useState(1);

  // useEffect hook called whenever a change is made to the 'sensorReadings' prop array. A check is first performed on whether this prop is null. If not, a second check is performed on whether the type of this prop is a string.
  // If not, the timeframeReadings state variable is calculated and updated by passing the sensorReadings prop to updateTimeframeReadings.
  // If the type of the sensorReadings prop is a string, the timeframeReadings state variable is updated directly with the value of the prop.
  useEffect(() => {
    if (sensorReadings !== null) {
      if (typeof sensorReadings !== "string") {
        updateTimeframeReadings("All time");
      } else {
        setTimeframeReadings(sensorReadings);
      }
    }
    // eslint-disable-next-line
  }, [sensorReadings]);

  // Calculates and updates the timeframeReadings state variable based on the value of the timeframe parameter. This is done by updating the currentTimeframe state variable with the parameter's value. A check is then performed on whether the timeframe parameter refers to all sensor data. If so, all sensor data is used for the rest of this function's execution. If not, a subset of the sensor data is used based on whether each sensor reading has a timestamp within the specified timeframe.
  // A check is then performed on whether the array of the selected sensor data has a length greater than 0. If not, a check is performed on whether the 'admin' prop is true. Based on the result, the timeframeReadings state variable is updated with an appropriate message.
  // If the selected sensor data array has a length greater than 0, the timeframeReadings state variable is update to the array's value. The average temperature, light intensity, moisture and humidity values of the selected sensor data are then calculated by iterating through the values of the array.The averageReading state variable is then set with the results.
  // The number of pages for the timeframeReadings array is calculated. This is done by first determining the number of times the length of the array is divisible by the number of readings per page (without a remainder), and then adding an additional page if a remainder exists.
  // An array of pagination numbers is then created. This is done by constructing an empty array with a length of the number of pages, then spreading the keys of the empty array into a second empty array.The values of the pagination number array are then all incremented by 1.
  // The allPaginationNumbers state variable is then set to the pagination numbers array, and the desktopPaginationNumbers and mobilePaginationNumbers state variables are set to appropriate slices of the pagination number array.
  const updateTimeframeReadings = (timeframe) => {
    setCurrentTimeframe(timeframe);

    let timeframe_readings = [];
    if (timeframe === "All time") {
      timeframe_readings = sensorReadings;
    } else {
      const now = new Date().getTime(),
        msPerHour = 3600000,
        msPerDay = 86400000,
        msPerWeek = 604800000;
      let endTime;

      switch (timeframe) {
        case "Hour":
          endTime = now - msPerHour;
          break;
        case "Day":
          endTime = now - msPerDay;
          break;
        case "Week":
          endTime = now - msPerWeek;
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
          timeframe_readings.push(sensorReading);
        }
      });
    }

    if (timeframe_readings.length > 0) {
      setTimeframeReadings(timeframe_readings);

      let averageTemperature,
        averageLightIntensity,
        averageMoisture,
        averageHumidity;
      timeframe_readings.forEach((timeframe_reading) => {
        averageTemperature += timeframe_reading.temp;
        averageLightIntensity += timeframe_reading.lightIntensity;
        averageMoisture += timeframe_reading.moisture;
        averageHumidity += timeframe_reading.humidity;
      });
      averageTemperature /= timeframe_readings.length;
      averageLightIntensity /= timeframe_readings.length;
      averageMoisture /= timeframe_readings.length;
      averageHumidity /= timeframe_readings.length;
      setAverageReading({
        temperature: averageTemperature,
        lightIntensity: averageLightIntensity,
        moisture: averageMoisture,
        humidity: averageHumidity,
      });

      let numPages = Math.floor(timeframe_readings.length / ITEMS_PER_PAGE);
      if (timeframe_readings.length % ITEMS_PER_PAGE !== 0) {
        numPages++;
      }
      let paginationNumbers = [...Array(numPages).keys()];
      paginationNumbers.forEach((paginationNumber) => {
        paginationNumbers[paginationNumber]++;
      });

      setAllPaginationNumbers(paginationNumbers);
      setDesktopPaginationNumbers(
        paginationNumbers.slice(0, MAX_DESKTOP_PAGINATION_NUMBERS)
      );
      setMobilePaginationNumbers(
        paginationNumbers.slice(0, MAX_MOBILE_PAGINATION_NUMBERS)
      );

      setCurrentPageNumber(1);
    } else {
      let message;
      if (timeframe === "All time") {
        if (admin) {
          message = "No sensor data available.";
        } else {
          message =
            "No sensor data available. Please make sure you have correctly input your token into the Arduino.";
        }
      } else {
        if (admin) {
          message =
            "No sensor data available. The sensors may not have collected enough data for this timeframe.";
        } else {
          message =
            "No sensor data available. Your sensors may not have collected enough data for this timeframe. Otherwise, please make sure you have correctly input your token into the Arduino.";
        }
      }

      setTimeframeReadings(message);
    }
  };

  // Returns a formatted string based on the value of the isoDate parameter. This is done by creating a new Date object, specifying that the parameter refers to UTC, then returning a formatted string adjusted to the Australia/Melbourne timezone.
  const getDate = (isoDate) => {
    const date = new Date(isoDate + "Z");
    return date.toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
  };

  // Navigates to the page specified by the pageNumber parameter. A check is first performed on whether the parameter is greater to or equal than 1, and less than or equal to the length of the allPaginationNumbers state variable. If not, the function returns.
  // Otherwise, a check is performed on whether the pageNumber parameter is equal to 1 less than the number at the start of the desktopPaginationNumbers state variable, or 1 greater than the number at end of the desktopPaginationNumbers array. If so, a further check is done on which of these 2 cases has occurred. If it is the former, a new potential desktop pagination number array is created from a slice of the allPaginationNumbers so that the pageNumber parameter occurs at the start of the slice. If it is the latter, the potential pagination number array is created so that the pageNumber parameter occurs at the end of the slice. Finally, a check is performed on whether the potential new desktop pagination number array has a length greater than or equal to the desktopPaginationNumbers state variable. If so, desktopPaginationNumbers is updated with the value of the new array.
  // The actions described in the previous paragraph are then repeated for the mobilePaginationNumbers state variable.
  // Finally, the currentPageNumber state variable is updated with the pageNumber parameter.
  const pageNavigate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= allPaginationNumbers.length) {
      if (
        pageNumber === desktopPaginationNumbers[0] - 1 ||
        pageNumber ===
          desktopPaginationNumbers[desktopPaginationNumbers.length - 1] + 1
      ) {
        let startIndex, finishIndex;
        if (pageNumber === desktopPaginationNumbers[0] - 1) {
          startIndex = pageNumber - 1;
          finishIndex = pageNumber + MAX_DESKTOP_PAGINATION_NUMBERS - 1;
        } else if (
          pageNumber ===
          desktopPaginationNumbers[desktopPaginationNumbers.length - 1] + 1
        ) {
          startIndex = pageNumber - MAX_DESKTOP_PAGINATION_NUMBERS;
          finishIndex = pageNumber;
        }

        const desktopNumbers = allPaginationNumbers.slice(
          startIndex,
          finishIndex
        );
        if (desktopNumbers.length >= desktopPaginationNumbers.length) {
          setDesktopPaginationNumbers(desktopNumbers);
        }
      }

      if (
        pageNumber === mobilePaginationNumbers[0] - 1 ||
        pageNumber ===
          mobilePaginationNumbers[mobilePaginationNumbers.length - 1] + 1
      ) {
        let startIndex, finishIndex;
        if (pageNumber === mobilePaginationNumbers[0] - 1) {
          startIndex = pageNumber - 1;
          finishIndex = pageNumber + MAX_MOBILE_PAGINATION_NUMBERS - 1;
        } else if (
          pageNumber ===
          mobilePaginationNumbers[mobilePaginationNumbers.length - 1] + 1
        ) {
          startIndex = pageNumber - MAX_MOBILE_PAGINATION_NUMBERS;
          finishIndex = pageNumber;
        }

        const mobileNumbers = allPaginationNumbers.slice(
          startIndex,
          finishIndex
        );
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
      {typeof timeframeReadings === "string" ? (
        <span style={{ color: "white" }}>{timeframeReadings}</span>
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
                {timeframeReadings
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
                {ITEMS_PER_PAGE -
                  timeframeReadings.slice(
                    ITEMS_PER_PAGE * (currentPageNumber - 1),
                    ITEMS_PER_PAGE * currentPageNumber
                  ).length >
                0
                  ? [
                      ...Array(
                        ITEMS_PER_PAGE -
                          timeframeReadings.slice(
                            ITEMS_PER_PAGE * (currentPageNumber - 1),
                            ITEMS_PER_PAGE * currentPageNumber
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
                ? desktopPaginationNumbers.map((desktopPaginationNumber) => {
                    return (
                      <li className="page-item" key={desktopPaginationNumber}>
                        <span
                          className={
                            currentPageNumber === desktopPaginationNumber
                              ? "page-link page-link-selected"
                              : "page-link"
                          }
                          tabIndex="0"
                          onClick={() => {
                            pageNavigate(desktopPaginationNumber);
                          }}
                          onKeyPress={() => {
                            pageNavigate(desktopPaginationNumber);
                          }}
                        >
                          {desktopPaginationNumber}
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
                updateTimeframeReadings("Hour");
              }}
              onKeyPress={() => {
                updateTimeframeReadings("Hour");
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
                updateTimeframeReadings("Day");
              }}
              onKeyPress={() => {
                updateTimeframeReadings("Day");
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
                updateTimeframeReadings("Week");
              }}
              onKeyPress={() => {
                updateTimeframeReadings("Week");
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
                updateTimeframeReadings("Month");
              }}
              onKeyPress={() => {
                updateTimeframeReadings("Month");
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
                updateTimeframeReadings("Year");
              }}
              onKeyPress={() => {
                updateTimeframeReadings("Year");
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
                updateTimeframeReadings("All time");
              }}
              onKeyPress={() => {
                updateTimeframeReadings("All time");
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
