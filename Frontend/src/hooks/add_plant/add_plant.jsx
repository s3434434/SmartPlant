import React, { useEffect, useState } from "react";
import "./add_plant.css";
import _ from "lodash";
import axios from "axios";

export default function AddPlant(props) {
  const { getLogin, wideView } = props;

  // Constant for a file reader used for the upload of image files. The FileReader's onload function is set to parse the file into base 64, then update the base64ImgString of the form state variable.
  const fileReader = new FileReader();
  fileReader.onload = function (fileLoadedEvent) {
    const tempForm = _.cloneDeep(form);

    let base64_img_string = fileLoadedEvent.target.result;
    const startIndex = base64_img_string.indexOf(",") + 1;
    base64_img_string = base64_img_string.substr(startIndex);
    tempForm.base64ImgString = base64_img_string;

    setForm(tempForm);
  };

  // State variables for the plant types, Add plant form, status of the Add plant request and whether that status is being shown.
  const [plantTypes, setPlantTypes] = useState([]);
  const [form, setForm] = useState({
    plantName: "",
    plantType: "",
    base64ImgString: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("-");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in on the UI. If not, the user is returned to the root path.
  // Otherwise, a GET request is made to the Plant types endpoint of the backend. If this request is unsuccessful, the user is returned to the root path.
  // Otherwise, the plantTypes state variable is set to the returned plant types array.
  useEffect(() => {
    document.title = "Add plant | Demeter - The plant meter";

    const login = getLogin();
    if (login !== null) {
      const { token } = login;

      axios
        .get("https://smart-plant.azurewebsites.net/api/Plants/List", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPlantTypes(res.data);
        })
        .catch((err) => {
          window.location.pathname = "/";
        });
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  // Updates the form state variable with the appropriate input field whenever a form input field is updated. If the input field is the file upload input for the image, the FileReader's readAsDataURL method is called.
  const handleChange = (e) => {
    const input = e.target;

    if (input.name === "base64ImgString") {
      fileReader.readAsDataURL(input.files[0]);
    } else {
      const tempForm = _.cloneDeep(form);
      tempForm[input.name] = input.value;

      setForm(tempForm);
    }
  };

  // Handles the submit event of the Add plant form. The request status is set appropriately, then a check is performed on whether the user is logged in. If not, an appropriate error message is shown and the user is returned to the root path.
  // Otherwise, a POST request is made to the backend Add plant endpoint.If this request is successful, the user is taken to the 'Plant added' page, with a URL parameter of the Arduino token in the response.Otherwise, an appropriate error message is shown.
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = getLogin();
    if (login !== null) {
      const { token } = login;
      axios
        .post("https://smart-plant.azurewebsites.net/api/Plants", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const tokenParameter = encodeURIComponent(res.data.messages.Token[0]);
          window.location.assign(
            `https://www.demeter.onl/plant-added?token=${tokenParameter}`
          );
        })
        .catch((err) => {
          const errors = err.response.data.messages;
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
        className={wideView ? "w-25 m-auto mt-4" : "m-auto mt-4 px-2"}
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
        <div className="form-text mt-2" style={{ color: "white" }}>
          Plant varieties courtesy of&nbsp;
          <a
            className="gold light-gold-hover"
            href={
              "https://extension.uga.edu/publications/detail.html?number=B1318&title=Growing%20Indoor%20Plants%20with%20Success"
            }
            style={{ textDecoration: "none" }}
          >
            University of Georgia
          </a>
          .
        </div>
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
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
        >
          <button className="btn btn-primary" type="submit">
            Add plant
          </button>
        </div>
      </form>
    </section>
  );
}
