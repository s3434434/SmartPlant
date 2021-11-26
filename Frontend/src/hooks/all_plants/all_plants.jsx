import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./all_plants.css";

export default function AllPlants(props) {
  const { wideView } = props;

  // Constant for the lazy-loaded dynamic import of the Pagination hook. This enables good code-splitting and faster page loading.
  const Pagination = lazy(() => import("../pagination/pagination"));

  // State variable for the user's plants. Initially set to 'Loading plants...' while the plants are being fetched from the backend.
  const [plants, setPlants] = useState("Loading plants...");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in on the UI. If not, the user is returned to the root path.
  // Otherwise, a GET request is made to Plants endpoint of the backend. If this request is unsuccessful, the plants state variable is set to an appropriate error message.
  // Otherwise, a check is performed on whether the returned plants array has a length greater than 0. If so, the plants state variable is updated with the array's sorted contents. Otherwise, the plants state variable is updated with an appropriate message.
  useEffect(() => {
    document.title = "Plants | Demeter - The plant meter";

    const login = props.getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .get("https://smart-plant.azurewebsites.net/api/Plants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const plantsFound = res.data;

          if (plantsFound.length > 0) {
            const sortedPlants = plantsFound.sort((a, b) => {
              const nameA = a.name,
                nameB = b.name;
              return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });
            setPlants(sortedPlants);
          } else {
            setPlants("No current plants.");
          }
        })
        .catch((err) => {
          setPlants(
            "There was an error retrieving your plant data. Please try again later."
          );
        });
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="text-center gold">Plants</h1>
      {wideView ? (
        <div className="container m-0 p-0">
          <div className="row">
            <div className="col-xl-2 text-center">
              <Link key="add-plant" className="btn btn-primary" to="/add-plant">
                Add plant
              </Link>
            </div>
            <div className="col-xl-10"></div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Link
            key="add-plant"
            className="btn btn-primary mt-2"
            to="/add-plant"
          >
            Add plant
          </Link>
        </div>
      )}
      {typeof plants === "string" ? (
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
          style={{ color: "white" }}
        >
          {plants}
        </div>
      ) : (
        <Suspense fallback={<div></div>}>
          <Pagination
            items={plants}
            itemID="plantID"
            heading1="Name"
            heading2="Variety"
            imageCol={true}
            itemTitle1="name"
            itemTitle2="plantType"
            path="plant"
            wideView={wideView}
          ></Pagination>
        </Suspense>
      )}
    </section>
  );
}
