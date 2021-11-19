import React, { useEffect, useState } from "react";
import axios from "axios";
import container_no_image from "../../assets/images/container_no_image.png";
import Pagination from "../pagination/pagination";
import "./all_plants_admin.css";

export default function AllPlantsAdmin(props) {
  const { getLogin, wideView } = props;
  const [plants, setPlants] = useState("Loading plants...");

  useEffect(() => {
    document.title = "Plants | Demeter - The plant meter";

    const login = getLogin();
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

              axios
                .get("https://smart-plant.azurewebsites.net/api/Admin/Users", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((res) => {
                  res.data.forEach((user) => {
                    sortedPlants.forEach((sortedPlant) => {
                      if (user.id === sortedPlant.userID) {
                        sortedPlant.email = user.email;
                      }
                    });
                  });

                  setPlants(sortedPlants);
                })
                .catch((err) => {
                  setPlants(
                    "There was an error retrieving your plant data. Please try again later."
                  );
                });
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
        <Pagination
          items={plants}
          itemID="plantID"
          heading1="Name"
          heading2="Email"
          defaultImage={container_no_image}
          itemTitle1="name"
          itemTitle2="email"
          path="plant-admin"
          wideView={wideView}
        ></Pagination>
      )}
    </section>
  );
}
