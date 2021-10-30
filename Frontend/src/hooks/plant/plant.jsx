import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./plant.css";

export default function Plant(props) {
  const startIndex = window.location.pathname.lastIndexOf("/") + 1;
  const [form, setForm] = useState({
      name: "",
      base64ImgString: "",
      plantID: window.location.pathname.substr(startIndex),
    }),
    [nameModifiable, setNameModifiable] = useState(false),
    [imageModifiable, setImageModifiable] = useState(false),
    [showNameStatus, setShowNameStatus] = useState(false),
    [nameStatus, setNameStatus] = useState("none"),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("none"),
    [plantType, setPlantType] = useState(""),
    [plantImage, setPlantImage] = useState(container_background);

  useEffect(() => {
    document.title = "Demeter - The plant meter";

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
          res.data.forEach((plant) => {
            if (plant.plantID === form.plantID) {
              document.title = `${plant.name} | Demeter - The plant meter`;

              let tempForm = _.cloneDeep(form);
              tempForm.name = plant.name;
              setForm(tempForm);

              if (plant.imgurURL !== null) {
                setPlantImage(plant.imgurURL);
              }
              setPlantType(plant.plantType);
            }
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

  const handleSubmit = (e, setStatus, setShowStatus) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);

      axios
        .put("https://smart-plant.azurewebsites.net/api/Plants", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          const errors = err.response.data.messages;
          let errorMessage = "Server error. Please try again later.";

          if (errors.PlantName !== undefined) {
            errorMessage = errors.PlantName[0];
          } else if (errors["Name Taken"] !== undefined) {
            errorMessage = errors["Name Taken"][0];
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
      <form
        className="w-25 m-auto d-none d-lg-block"
        onSubmit={(e) => {
          handleSubmit(e, setNameStatus, setShowNameStatus);
        }}
      >
        {nameModifiable ? (
          <>
            <label className="form-label gold" htmlFor="name">
              Name
            </label>
            <input
              className="form-control mb-3"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        ) : (
          <>
            <div className="text-end m-0 p-0">
              <FontAwesomeIcon
                className="gold light-gold-hover"
                icon={faPen}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setNameModifiable(true);
                }}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-center gold m-0 mb-2 p-0">{form.name}</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        )}
        <div className={showNameStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{nameStatus}</span>
        </div>
        <div className={nameModifiable ? "text-center my-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form
        className="m-auto px-2 d-lg-none"
        onSubmit={(e) => {
          handleSubmit(e, setNameStatus, setShowNameStatus);
        }}
      >
        {nameModifiable ? (
          <>
            <label className="form-label gold" htmlFor="name">
              Name
            </label>
            <input
              className="form-control mb-3"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
            />
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        ) : (
          <>
            <div className="text-end m-0 p-0">
              <FontAwesomeIcon
                className="gold light-gold-hover"
                icon={faPen}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setNameModifiable(true);
                }}
              ></FontAwesomeIcon>
            </div>
            <h1 className="text-center gold m-0 mb-2 p-0">{form.name}</h1>
            <h4 className="text-center m-0 p-0" style={{ color: "white" }}>
              {plantType}
            </h4>
          </>
        )}
        <div className={showNameStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{nameStatus}</span>
        </div>
        <div className={nameModifiable ? "text-center my-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto d-none d-lg-block"
        onSubmit={(e) => {
          handleSubmit(e, setImageStatus, setShowImageStatus);
        }}
      >
        {imageModifiable ? (
          <>
            <label className="form-label gold" htmlFor="base64ImgString">
              Image
            </label>
            <input
              className="form-control"
              name="base64ImgString"
              type="file"
              required
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10"></div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setImageModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div
              className="cg-container gold-border m-auto mt-1"
              style={{
                backgroundImage: `url(${plantImage})`,
              }}
            >
              {plantImage === container_background ? (
                <h2>No current image</h2>
              ) : null}
            </div>
          </>
        )}
        <div className={showImageStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{imageStatus}</span>
        </div>
        <div className={imageModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-lg-none"
        onSubmit={(e) => {
          handleSubmit(e, setImageStatus, setShowImageStatus);
        }}
      >
        {imageModifiable ? (
          <>
            <label className="form-label gold" htmlFor="base64ImgString">
              Image
            </label>
            <input
              className="form-control"
              name="base64ImgString"
              type="file"
              required
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10"></div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setImageModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div
              className="cg-container gold-border m-auto mt-1"
              style={{
                backgroundImage: `url(${plantImage})`,
              }}
            >
              {plantImage === container_background ? (
                <h2>No current image</h2>
              ) : null}
            </div>
          </>
        )}
        <div className={showImageStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{imageStatus}</span>
        </div>
        <div className={imageModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Apply change
          </button>
        </div>
      </form>
    </section>
  );
}
