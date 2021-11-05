import React, { useEffect, useState } from "react";
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
    <>
      <div className="w-50 m-auto d-none d-xl-block overflow-auto">
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                {defaultImage !== null ? (
                  <th>
                    <h3 style={{ visibility: "hidden" }}>
                      --------------------------------
                    </h3>
                  </th>
                ) : null}
                <th>
                  <h3>{heading1}</h3>
                </th>
                <th>
                  <h3>{heading2}</h3>
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
                      onClick={(e) => {
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
                        <h3 style={{ cursor: "pointer" }}>{title1}</h3>
                      </td>
                      <td
                        className={
                          defaultImage !== null
                            ? "align-middle text-center"
                            : "align-middle"
                        }
                      >
                        <h4 style={{ cursor: "pointer" }}>{title2}</h4>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <nav
          className="w-50 m-auto overflow-auto"
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
      </div>
      <div className="m-auto d-xl-none">
        <div className="overflow-auto">
          <table className="table">
            <thead>
              <tr>
                {defaultImage !== null ? (
                  <th>
                    <h4 style={{ visibility: "hidden" }}>--------------</h4>
                  </th>
                ) : null}
                <th>
                  <h4>{heading1}</h4>
                </th>
                <th>
                  <h4>{heading2}</h4>
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
                      onClick={(e) => {
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
                        <h4 style={{ cursor: "pointer" }}>{title1}</h4>
                      </td>
                      <td
                        className={
                          defaultImage !== null
                            ? "align-middle text-center"
                            : "align-middle"
                        }
                      >
                        <h5 style={{ cursor: "pointer" }}>{title2}</h5>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <nav
          className="m-auto overflow-auto"
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
      </div>
    </>
  );
}
