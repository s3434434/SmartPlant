import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./all_plants.css";

export default function AllPlants(props) {
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
            const sortedPlants = res.data.sort((a, b) => {
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
      <div className="d-none d-xl-block">
        <div className="container m-0 p-0">
          <div className="row">
            <div className="col-xl-2 text-center">
              <Link key="add-plant" to="/add-plant">
                <button className="btn btn-primary">Add plant</button>
              </Link>
            </div>
            <div className="col-xl-10"></div>
          </div>
        </div>
      </div>
      <div className="text-center d-xl-none">
        <Link key="add-plant" to="/add-plant">
          <button className="btn btn-primary mt-2">Add plant</button>
        </Link>
      </div>
      {typeof plants === "string" ? (
        <div className="text-center mt-3" style={{ color: "white" }}>
          {plants}
        </div>
      ) : (
        <div className="content-gallery mt-4">
          {plants.map((plant) => {
            const { name, plantType, plantID } = plant;
            let plantImage = container_background;
            if (plant.imgurURL !== null) {
              plantImage = plant.imgurURL;
            }

            return (
              <div
                id={plantID}
                key={plantID}
                className="cg-container"
                style={{
                  backgroundImage: `url(${plantImage})`,
                  cursor: "pointer",
                }}
                onMouseEnter={() => {
                  document.getElementById(
                    plantID
                  ).style.backgroundImage = `url(${plantImage}), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))`;
                }}
                onMouseLeave={() => {
                  document.getElementById(
                    plantID
                  ).style.backgroundImage = `url(${plantImage})`;
                }}
                onClick={(e) => {
                  window.location.pathname = `/plant/${plantID}`;
                }}
              >
                <h1 style={{ cursor: "pointer" }}>{name}</h1>
                <h2 style={{ cursor: "pointer" }}>{plantType}</h2>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
