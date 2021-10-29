import React, { useEffect, useState } from "react";
import "./add_plant.css";
import _ from "lodash";
import axios from "axios";

export default function AddPlant(props) {
  const [plantTypes, setPlantTypes] = useState([]);
  const [form, setForm] = useState({
    plantName: "",
    plantType: "",
    base64ImgString: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

  useEffect(() => {
    document.title = "Add plant | Demeter - The plant meter";

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
          axios
            .get("https://smart-plant.azurewebsites.net/api/Plants/List", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              setPlantTypes(res.data);
            });
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

  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);

    if (input.name === "base64ImgString") {
      const fileReader = new FileReader();
      fileReader.onload = function (fileLoadedEvent) {
        let base64 = fileLoadedEvent.target.result;
        const startIndex = base64.indexOf(",") + 1;
        base64 = base64.substr(startIndex);

        tempForm[input.name] = base64;
      };

      fileReader.readAsDataURL(input.files[0]);
    } else {
      tempForm[input.name] = input.value;
    }

    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

      axios
        .post("https://smart-plant.azurewebsites.net/api/Plants", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.location.pathname = "/plants";
        })
        .catch((err) => {
          const errors = err.response.data.errors;
          let errorMessage = "Server error. Please try again later.";

          if (errors.PlantName !== undefined) {
            errorMessage = errors.PlantName[0];
          } else if (errors["Name Taken"] !== undefined) {
            errorMessage = errors["Name Taken"][0];
          } else if (errors["Plant Type"] !== undefined) {
            errorMessage = errors["Plant Type"][0];
          } else if (errors.Limit !== undefined) {
            errorMessage = errors.Limit[0];
          }

          setStatus(errorMessage);
        });
    } else {
      setStatus("You are not logged in.");
      setTimeout(() => {
        window.location.pathname = "/";
      }, 500);
    }
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
          type="text"
          className="form-control"
          name="plantName"
          value={form.plantName}
          onChange={handleChange}
          required
        />
        <label className="form-label gold mt-3" htmlFor="plantType">
          Variety
        </label>
        <select
          className="form-control"
          name="plantType"
          onChange={handleChange}
          required
        >
          {plantTypes.length === 0 ? (
            <option key="default" value="">
              Loading plant varieties...
            </option>
          ) : (
            <>
              <option key="default" value="">
                Please select a plant
              </option>
              {plantTypes.sort().map((plantType) => {
                return (
                  <option key={plantType} value={plantType}>
                    {plantType}
                  </option>
                );
              })}
            </>
          )}
        </select>
        <label className="form-label gold mt-3" htmlFor="base64ImgString">
          Image
        </label>
        <input
          className="form-control"
          name="base64ImgString"
          onChange={handleChange}
          type="file"
        ></input>
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
          type="text"
          className="form-control"
          name="plantName"
          value={form.plantName}
          onChange={handleChange}
          required
        />
        <label className="form-label gold mt-3" htmlFor="plantType">
          Variety
        </label>
        <select
          className="form-control"
          name="plantType"
          onChange={handleChange}
          required
        >
          {plantTypes.length === 0 ? (
            <option key="default" value="">
              Loading plant varieties...
            </option>
          ) : (
            <>
              <option key="default" value="">
                Please select a plant
              </option>
              {plantTypes.sort().map((plantType) => {
                return (
                  <option key={plantType} value={plantType}>
                    {plantType}
                  </option>
                );
              })}
            </>
          )}
        </select>
        <label className="form-label gold mt-3" htmlFor="plantImage">
          Image
        </label>
        <input
          className="form-control"
          name="plantImage"
          onChange={handleChange}
          type="file"
        ></input>
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
