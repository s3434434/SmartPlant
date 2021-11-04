import React, { useEffect, useState } from "react";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./all_plants_admin.css";

export default function AllPlantsAdmin(props) {
  const [plants, setPlants] = useState("Loading plants...");

  useEffect(() => {
    document.title = "Plants | Demeter - The plant meter";

    const login = props.getLogin();
    if (login !== null) {
      const { token, admin } = login;

      if (admin) {
        axios
          .get("https://smart-plant.azurewebsites.net/api/Admin/Plants", {
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
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="text-center gold">Plants</h1>
      {typeof plants === "string" ? (
        <div className="text-center mt-3" style={{ color: "white" }}>
          {plants}
        </div>
      ) : (
        <div className="content-gallery mt-4">
          {plants.map((plant) => {
            const { name, plantID, userID } = plant;
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
                  window.location.pathname = `/plant-admin/${plantID}`;
                }}
              >
                <h1 style={{ cursor: "pointer" }}>{name}</h1>
                <h3 className="user-id" style={{ cursor: "pointer" }}>
                  {userID}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
