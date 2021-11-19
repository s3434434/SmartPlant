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
  // State variables for the current page number, and for the current pagination numbers for desktop and mobile.
  const [currentPageNumber, setCurrentPageNumber] = useState(1),
    [desktopPaginationNumbers, setDesktopPaginationNumbers] = useState([]),
    [mobilePaginationNumbers, setMobilePaginationNumbers] = useState([]);

  // useEffect hook called whenever a change is made to the 'items' array prop. A check is performed on whether the length of the array is greater than 0. If so, an array of pagination numbers is created using createPaginationNumbers. The desktopPaginationNumbers and mobilePaginationNumbers state variables are then set to appropriate slices of the pagination number array.
  useEffect(() => {
    if (items.length > 0) {
      const numbers = createPaginationNumbers();
      setDesktopPaginationNumbers(numbers.slice(0, 10));
      setMobilePaginationNumbers(numbers.slice(0, 5));
    }
    // eslint-disable-next-line
  }, [items]);

  // Calculates and returns the number of pages for the 'items' array prop. This is done by first calculating the number of times the length of the array is divisible by 10 (without a remainder), and then adding an additional page if a remainder exists.
  const getNumPages = () => {
    let numPages = Math.floor(items.length / 10);
    if (items.length % 10 !== 0) {
      numPages++;
    }

    return numPages;
  };

  // Creates and returns an array of pagination numbers. This is done by first getting the correct number of pages using getNumPages. The array is then created by constructing an empty array with the length of the number of pages, then spreading the keys of the empty array into a second empty array. The values of the pagination numbers array are then all incremented by 1.
  const createPaginationNumbers = () => {
    const numPages = getNumPages();

    let paginationNumbers = [...Array(numPages).keys()];
    paginationNumbers.forEach((paginationNumber) => {
      paginationNumbers[paginationNumber]++;
    });

    return paginationNumbers;
  };

  // Navigates to the page specified by the pageNumber parameter. A check is first performed on whether the parameter is greater to or equal than 1, and less than or equal to the number of pages for the 'items' array prop.
  const pageNavigate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= getNumPages()) {
      const numbers = createPaginationNumbers();

      if (pageNumber < desktopPaginationNumbers[0]) {
        const desktopNumbers = numbers.slice(pageNumber - 1, pageNumber + 9);

        if (desktopNumbers.length >= desktopPaginationNumbers.length) {
          setDesktopPaginationNumbers(desktopNumbers);
        }
      } else if (pageNumber > desktopPaginationNumbers[9]) {
        const desktopNumbers = numbers.slice(pageNumber - 10, pageNumber);

        if (desktopNumbers.length >= desktopPaginationNumbers.length) {
          setDesktopPaginationNumbers(desktopNumbers);
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
      <nav
        className={
          wideView ? "w-50 m-auto overflow-auto" : "m-auto overflow-auto"
        }
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
    </div>
  );
}
