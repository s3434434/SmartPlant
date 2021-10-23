import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import container_background_07 from "../../assets/images/container_background_07.png";
import "./all_plants.css";

export default function AllPlants(props) {
  const [plants, setPlants] = useState(null);

  useEffect(() => {
    document.title = "Plants | Demeter - The plant meter";

    const login = localStorage.getItem("demeter-login");
    const { token } = JSON.parse(login);
    axios
      .get("https://smart-plant.azurewebsites.net/api/Plants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPlants(res.data);
      })
      .catch((err) => {
        props.logOut();
        window.location.pathname = "/";
      });

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
              const { name, plantID } = plant;

              return (
                <div className="flex-padding" key={plantID}>
                  <div
                    id={plantID}
                    className="cg-container"
                    style={{
                      backgroundImage: `url(${container_background})`,
                    }}
                    onMouseEnter={() => {
                      document.getElementById(
                        plantID
                      ).style.backgroundImage = `url(${container_background_07})`;
                    }}
                    onMouseLeave={() => {
                      document.getElementById(
                        plantID
                      ).style.backgroundImage = `url(${container_background})`;
                    }}
                    onClick={(e) => {
                      window.location.pathname = `/plant/${plantID}`;
                    }}
                  >
                    <h1>{name}</h1>
                  </div>
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
