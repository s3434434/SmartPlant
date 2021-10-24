import React, { useEffect, useState } from "react";
import "./add_plant.css";
import axios from "axios";

export default function AddPlant(props) {
  const [plantName, setPlantName] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

  useEffect(() => {
    document.title = "Add plant | Demeter - The plant meter";

    const login = localStorage.getItem("demeter-login");
    const { token } = JSON.parse(login);
    axios
      .get("https://smart-plant.azurewebsites.net/api/Plants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        props.logOut();
        window.location.pathname = "/";
      });

    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setPlantName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = localStorage.getItem("demeter-login");
    const { token } = JSON.parse(login);

    axios
      .post(
        "https://smart-plant.azurewebsites.net/api/Plants",
        {
          plantName: plantName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        window.location.pathname = "/plants";
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        let errorMessage = "Server error. Please try again later.";

        if (errors.PlantName !== undefined) {
          errorMessage = errors.PlantName[0];
        }

        setStatus(errorMessage);
      });
  };

  return (
    <section>
      <h1 className="gold text-center">Add plant</h1>
      <form
        className="w-25 m-auto mt-4 d-none d-lg-block"
        onSubmit={handleSubmit}
      >
        <label className="form-label gold" htmlFor="plantName">
          Name
        </label>
        <input
          className="form-control"
          name="plantName"
          type="text"
          required
          value={plantName}
          onChange={handleChange}
        />
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Add plant
          </button>
        </div>
      </form>

      <form className="m-auto mt-4 d-lg-none px-2" onSubmit={handleSubmit}>
        <label className="form-label gold" htmlFor="plantName">
          Name
        </label>
        <input
          className="form-control"
          name="plantName"
          type="text"
          required
          value={plantName}
          onChange={handleChange}
        />
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Add plant
          </button>
        </div>
      </form>
    </section>
  );
}
