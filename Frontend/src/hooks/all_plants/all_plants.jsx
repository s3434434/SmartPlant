import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "../pagination/pagination";
import "./all_plants.css";

export default function AllPlants(props) {
  const { wideView } = props;
  const [plants, setPlants] = useState("Loading plants...");

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
        <div className="text-center mt-3" style={{ color: "white" }}>
          {plants}
        </div>
      ) : (
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
      )}
    </section>
  );
}
