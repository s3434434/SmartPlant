import React, { useEffect, useState } from "react";
import axios from "axios";
import container_no_image from "../../assets/images/container_no_image.png";
import Pagination from "../pagination/pagination";
import "./all_plants_admin.css";

export default function AllPlantsAdmin(props) {
  const { getLogin, wideView } = props;

  // State variable for Demeter's plants. Initially set to 'Loading plants...' while the plants are being fetched from the backend.
  const [plants, setPlants] = useState("Loading plants...");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in and an administrator on the UI. If not, the user is returned to the root path.
  // Otherwise, a GET request is made to Plants admin endpoint of the backend. If this request is unsuccessful, the plants state variable is set to an appropriate error message.
  // Otherwise, a check is performed on whether the returned plants array has a length greater than 0. If not, the plants state variable is updated with an appropriate message.
  // Otherwise, a GET request is made to the Users admin endpoint of the backend. If this request fails, the plants state variable is updated with an appropriate message.
  // Otherwise, the plants array returned from the Plants admin endpoint is copied. The user array returned from the Users admin endpoint is iterated through, and for each user the copied plants array is iterated through.
  // For each plant in the copied plants array, a check is performed on whether that plant's userID matches the userID of user of the current iteration of the users array. If so, that user's email is added to the plant as an 'email' property.
  // Finally, the plants state variable is updated with the value of the copied plants array.
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
                    "There was an error retrieving the plant data. Please try again later."
                  );
                });
            } else {
              setPlants("No current plants.");
            }
          })
          .catch((err) => {
            setPlants(
              "There was an error retrieving the plant data. Please try again later."
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
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
          style={{ color: "white" }}
        >
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
