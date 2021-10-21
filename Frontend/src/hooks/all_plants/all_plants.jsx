import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import container_background_07 from "../../assets/images/container_background_07.png";
import "./all_plants.css";

export default function AllPlants(props) {
  const [plants, setPlants] = useState({});

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
        console.log(JSON.stringify(res));
        // setPlants(res.data);
      })
      .catch((err) => {
        // props.logOut();
        // window.location.pathname = "/";
      });

    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="text-center gold">Plants</h1>
      {plants ? (
        <>
          <div className="container mt-3">
            <div className="row">
              <div className="col-sm-3 text-center">
                <Link key="add-plant" to="/add-plant">
                  <button className="btn btn-primary">Add plant</button>
                </Link>
              </div>
              <div className="col-sm-3"></div>
              <div className="col-sm-3"></div>
              <div className="col-sm-3"></div>
            </div>
          </div>
          <div className="content-gallery mt-3">
            {Object.keys(plants).length > 0 ? (
              Object.keys(plants)
                .sort()
                .map((plant) => {
                  return (
                    <div className="flex-padding" key={plants[plant].name}>
                      <div
                        id={plant}
                        className="cg-container"
                        style={{
                          backgroundImage: `url(${container_background})`,
                        }}
                        onMouseEnter={() => {
                          document.getElementById(
                            plant
                          ).style.backgroundImage = `url(${container_background_07})`;
                        }}
                        onMouseLeave={() => {
                          document.getElementById(
                            plant
                          ).style.backgroundImage = `url(${container_background})`;
                        }}
                        onClick={(e) => {
                          window.location.pathname = `/plant/${plant}`;
                        }}
                      >
                        <h1>{plant}</h1>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p style={{ color: "white" }}>No current plants.</p>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
