import React, { useEffect, useState } from "react";
import container_no_image from "../../assets/images/container_no_image.png";
import "./pagination.css";

export default function Pagination(props) {
  const {
    items,
    itemID,
    heading1,
    heading2,
    imageCol,
    itemTitle1,
    itemTitle2,
    path,
    wideView,
  } = props;

  // Constants for the maximum number of desktop and mobile pagination numbers showing at any one time.
  const MAX_DESKTOP_PAGINATION_NUMBERS = 10,
    MAX_MOBILE_PAGINATION_NUMBERS = 5;

  // State variables for all pagination numbers, the current pagination numbers for desktop and mobile, and the current page number.
  const [allPaginationNumbers, setAllPaginationNumbers] = useState([]),
    [desktopPaginationNumbers, setDesktopPaginationNumbers] = useState([]),
    [mobilePaginationNumbers, setMobilePaginationNumbers] = useState([]),
    [currentPageNumber, setCurrentPageNumber] = useState(1);

  // useEffect hook called whenever a change is made to the 'items' array prop. A check is performed on whether the length of the array is greater than 0. If not, the function returns.
  // Otherwise, the number of pages for the 'items' array prop is calculated. This is done by first determining the number of times the length of the array is divisible by the number of items per page (without a remainder), and then adding an additional page if a remainder exists.
  // An array of pagination numbers is then created. This is done by constructing an empty array with a length of the number of pages, then spreading the keys of the empty array into a second empty array.The values of the pagination number array are then all incremented by 1.
  // The allPaginationNumbers state variable is then set to the pagination numbers array, and the desktopPaginationNumbers and mobilePaginationNumbers state variables are set to appropriate slices of the pagination number array.
  useEffect(() => {
    if (items.length > 0) {
      const itemsPerPage = 10;

      let numPages = Math.floor(items.length / itemsPerPage);
      if (items.length % itemsPerPage !== 0) {
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
    }
    // eslint-disable-next-line
  }, [items]);

  // Navigates to the page specified by the pageNumber parameter. A check is first performed on whether the parameter is greater to or equal than 1, and less than or equal to the length of the allPaginationNumbers state variable. If not, the function returns.
  // Otherwise, an array of potential desktop pagination numbers and an array of potential mobile pagination numbers are declared. A check is then performed on whether the pageNumber parameter is smaller than the smallest page number in the desktopPaginationNumbers state variable. If so, the array of potential desktop pagination numbers is set to a slice of thesliced from the allPaginationNumbers state variable with a start index . If the length of this array is greater than or equal to that of the current desktopPaginationNumbers state variable array, then the new array will replace it.
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
      className={wideView ? "w-50 mx-auto overflow-auto" : "mx-auto"}
      style={{
        marginTop: imageCol
          ? wideView
            ? "-6em"
            : "-3em"
          : wideView
          ? "2em"
          : "1em",
      }}
    >
      <div className="overflow-auto">
        <table className="table">
          <thead>
            <tr>
              {imageCol ? (
                <th>
                  <img
                    src={container_no_image}
                    alt="Header spacer"
                    style={{ opacity: 0 }}
                  ></img>
                </th>
              ) : null}
              <th className={imageCol ? "text-center" : ""}>
                {wideView ? <h3>{heading1}</h3> : <h4>{heading1}</h4>}
              </th>
              <th className={imageCol ? "text-center" : ""}>
                {wideView ? <h3>{heading2}</h3> : <h4>{heading2}</h4>}
              </th>
            </tr>
          </thead>
          <tbody>
            {items
              .slice(10 * (currentPageNumber - 1), 10 * currentPageNumber)
              .map((item) => {
                const id = item[itemID],
                  title1 = item[itemTitle1],
                  title2 = item[itemTitle2];
                let image = container_no_image;
                if (item.imgurURL !== undefined) {
                  if (item.imgurURL !== null) {
                    image = item.imgurURL;
                  }
                }

                return (
                  <tr
                    key={id}
                    className="pagination-tr"
                    tabIndex="0"
                    onClick={(e) => {
                      window.location.pathname = `/${path}/${id}`;
                    }}
                    onKeyPress={(e) => {
                      window.location.pathname = `/${path}/${id}`;
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {imageCol ? (
                      <td className="align-middle">
                        <img
                          id={`${id}-image`}
                          src={image}
                          alt={title1}
                          style={{
                            cursor: "pointer",
                          }}
                        ></img>
                      </td>
                    ) : null}
                    <td
                      className={
                        imageCol ? "align-middle text-center" : "align-middle"
                      }
                    >
                      {wideView ? (
                        <h4 style={{ cursor: "pointer" }}>{title1}</h4>
                      ) : (
                        <h5 style={{ cursor: "pointer" }}>{title1}</h5>
                      )}
                    </td>
                    <td
                      className={
                        imageCol ? "align-middle text-center" : "align-middle"
                      }
                    >
                      {wideView ? (
                        <h4 style={{ cursor: "pointer" }}>{title2}</h4>
                      ) : (
                        <h5 style={{ cursor: "pointer" }}>{title2}</h5>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <nav className="overflow-auto" style={{ backgroundColor: "transparent" }}>
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
    </div>
  );
}
