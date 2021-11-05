import React, { useEffect, useState } from "react";
import "./pagination.css";

export default function Pagination(props) {
  const { items, itemID, defaultImage, itemTitle1, itemTitle2, path } = props;
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
                      onMouseEnter={() => {
                        document.getElementById(
                          `${id}-image`
                        ).style.backgroundImage = `url(${image}), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))`;
                      }}
                      onMouseLeave={() => {
                        document.getElementById(
                          `${id}-image`
                        ).style.backgroundImage = `url(${image})`;
                      }}
                      onClick={(e) => {
                        window.location.pathname = `/${path}/${id}`;
                      }}
                      style={{ cursor: "pointer" }}
                    >
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
                      <td className="text-center align-middle gold">
                        <h3 style={{ cursor: "pointer" }}>{title1}</h3>
                      </td>
                      <td className="text-center align-middle">
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
            <tbody>
              {items
                .slice(10 * (currentPageNumber - 1), 10 * currentPageNumber)
                .map((item) => {
                  const id = item[itemID],
                    title1 = item[itemTitle1],
                    title2 = item[itemTitle2];
                  let image = defaultImage;
                  if (item.imgurURL !== null) {
                    image = item.imgurURL;
                  }
                  return (
                    <tr
                      key={id}
                      onMouseEnter={() => {
                        document.getElementById(
                          `${id}-image`
                        ).style.backgroundImage = `url(${image}), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))`;
                      }}
                      onMouseLeave={() => {
                        document.getElementById(
                          `${id}-image`
                        ).style.backgroundImage = `url(${image})`;
                      }}
                      onClick={(e) => {
                        window.location.pathname = `/${path}/${id}`;
                      }}
                      style={{ cursor: "pointer" }}
                    >
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
                      <td className="text-center align-middle gold">
                        <h3 style={{ cursor: "pointer" }}>{title1}</h3>
                      </td>
                      <td className="text-center align-middle">
                        <h4 style={{ cursor: "pointer" }}>{title2}</h4>
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
