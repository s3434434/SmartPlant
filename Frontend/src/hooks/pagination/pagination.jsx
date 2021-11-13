import React, { useEffect, useState } from "react";
import container_no_image from "../../assets/images/container_no_image.png";
import "./pagination.css";

export default function Pagination(props) {
  const {
    items,
    itemID,
    heading1,
    heading2,
    defaultImage,
    itemTitle1,
    itemTitle2,
    path,
    wideView,
  } = props;
  const [currentPageNumber, setCurrentPageNumber] = useState(1),
    [paginationNumbers, setPaginationNumbers] = useState([]),
    [mobilePaginationNumbers, setMobilePaginationNumbers] = useState([]);

  useEffect(() => {
    if (items.length > 0) {
      const numbers = createPaginationNumbers();
      setPaginationNumbers(numbers.slice(0, 10));
      setMobilePaginationNumbers(numbers.slice(0, 5));
    }
    // eslint-disable-next-line
  }, [items]);

  const getNumPages = () => {
    let numPages = Math.floor(items.length / 10);
    if (items.length % 10 !== 0) {
      numPages++;
    }

    return numPages;
  };

  const createPaginationNumbers = () => {
    const numPages = getNumPages();

    let numbers = [...Array(numPages).keys()];
    numbers.forEach((number) => {
      numbers[number]++;
    });

    return numbers;
  };

  const pageNavigate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= getNumPages()) {
      const numbers = createPaginationNumbers();

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
      className={wideView ? "w-50 mx-auto overflow-auto" : "mx-auto"}
      style={{
        marginTop:
          defaultImage !== null
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
              {defaultImage !== null ? (
                <th>
                  <img
                    src={container_no_image}
                    alt="Header spacer"
                    style={{ opacity: 0 }}
                  ></img>
                </th>
              ) : null}
              <th className={defaultImage !== null ? "text-center" : ""}>
                {wideView ? <h3>{heading1}</h3> : <h4>{heading1}</h4>}
              </th>
              <th className={defaultImage !== null ? "text-center" : ""}>
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
                let image = defaultImage;
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
                    {defaultImage !== null ? (
                      <td className="align-middle">
                        <img
                          id={`${id}-image`}
                          src={image}
                          alt={id}
                          style={{
                            cursor: "pointer",
                          }}
                        ></img>
                      </td>
                    ) : null}
                    <td
                      className={
                        defaultImage !== null
                          ? "align-middle text-center"
                          : "align-middle"
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
                        defaultImage !== null
                          ? "align-middle text-center"
                          : "align-middle"
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
    </div>
  );
}
