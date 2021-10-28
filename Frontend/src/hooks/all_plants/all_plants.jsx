import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./all_plants.css";

export default function AllPlants(props) {
  const [plants, setPlants] = useState(null);

  useEffect(() => {
    document.title = "Plants | Demeter - The plant meter";

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);
      axios
        .get("https://smart-plant.azurewebsites.net/api/Plants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const sortedPlants = res.data.sort((a, b) => {
            const nameA = a.name,
              nameB = b.name;
            return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
          });

          setPlants(sortedPlants);
        })
        .catch((err) => {
          props.logOut();
          window.location.pathname = "/";
        });
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="text-center gold">Plants</h1>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-2 text-center">
            <Link key="add-plant" to="/add-plant">
              <button className="btn btn-primary">Add plant</button>
            </Link>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-2"></div>
          <div className="col-md-2"></div>
          <div className="col-md-2"></div>
          <div className="col-md-2"></div>
        </div>
      </div>
      {plants ? (
        plants.length > 0 ? (
          <div className="content-gallery mt-4">
            {plants.map((plant) => {
              const { name, type, plantID } = plant;
              let plantImage = container_background;
              if (plant.plantImage !== undefined) {
                plantImage = plant.plantImage;
              }

              return (
                <div
                  id={plantID}
                  key={plantID}
                  className="cg-container"
                  style={{
                    backgroundImage: `url(${plantImage})`,
                    backgroundBlendMode: "overlay",
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
                  <h1>{name}</h1>
                  <h2>{type}</h2>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mt-3" style={{ color: "white" }}>
            No current plants.
          </div>
        )
      ) : (
        <div className="text-center mt-3" style={{ color: "white" }}>
          Loading plants...
        </div>
      )}
    </section>
  );
}
