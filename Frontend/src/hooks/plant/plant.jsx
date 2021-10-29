import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./plant.css";

export default function Plant(props) {
  const [form, setForm] = useState({
      plantName: "",
      plantType: "",
      base64ImgString: "",
    }),
    [imageModifiable, setImageModifiable] = useState(false),
    [detailsModifiable, setDetailsModifiable] = useState(false),
    [nameModifiable, setNameModifiable] = useState(false),
    [typeModifiable, setTypeModifiable] = useState(false),
    [showImageStatus, setShowImageStatus] = useState(false),
    [imageStatus, setImageStatus] = useState("none"),
    [showDetailsStatus, setShowDetailsStatus] = useState(false),
    [detailsStatus, setDetailsStatus] = useState("none"),
    [plantImage, setPlantImage] = useState(container_background),
    [plantTypes, setPlantTypes] = useState([]);

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
          const startIndex = window.location.pathname.lastIndexOf("/") + 1;
          const plantID = window.location.pathname.substr(startIndex);

          res.data.forEach((plant) => {
            if (plant.plantID === plantID) {
              document.title = `${plant.name} | Demeter - The plant meter`;

              let tempForm = _.cloneDeep(form);
              tempForm.plantName = plant.name;
              tempForm.plantType = plant.plantType;

              setForm(tempForm);

              if (plant.imgurURL !== null) {
                setPlantImage(plant.imgurURL);
              }
            }
          });
        })
        .catch((err) => {
          props.logOut();
          window.location.pathname = "/";
        });

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
      <h1 className="text-center gold">{form.plantName}</h1>

      <form
        className="w-25 m-auto mt-4 d-none d-lg-block"
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
            <div className="mt-1 p-1 gold-border">
              <div
                className="cg-container"
                style={{
                  backgroundImage: `url(${plantImage})`,
                  backgroundSize: "cover",
                }}
              >
                {plantImage === container_background ? (
                  <h1>No current image</h1>
                ) : null}
              </div>
            </div>
          </>
        )}
        <div className={showImageStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{imageStatus}</span>
        </div>
        <div className={imageModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Update image
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-4 px-2 d-lg-none"
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
            <div className="mt-1 p-1 gold-border">
              <div
                className="cg-container"
                style={{
                  backgroundImage: `url(${plantImage})`,
                  backgroundSize: "cover",
                }}
              >
                {plantImage === container_background ? (
                  <h1>No current image</h1>
                ) : null}
              </div>
            </div>
          </>
        )}
        <div className={showImageStatus ? "text-center mt-3" : "hidden-field"}>
          <span>{imageStatus}</span>
        </div>
        <div className={imageModifiable ? "text-center mt-3" : "hidden-field"}>
          <button className="btn btn-primary" type="submit">
            Update image
          </button>
        </div>
      </form>

      <form
        className="w-25 m-auto mt-5 d-none d-lg-block"
        onSubmit={(e) => {
          handleSubmit(e, setDetailsStatus, setShowDetailsStatus);
        }}
      >
        {nameModifiable ? (
          <>
            <label className="form-label gold" htmlFor="plantName">
              Name
            </label>
            <input
              className="form-control"
              name="plantName"
              type="text"
              value={form.plantName}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10">
                  <span className="gold">Name</span>
                </div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setNameModifiable(true);
                      setDetailsModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{form.plantName}</span>
            </div>
          </>
        )}
        {typeModifiable ? (
          <>
            <label className="form-label gold mt-2" htmlFor="plantType">
              Variety
            </label>
            <select
              className="form-control"
              name="plantType"
              onChange={handleChange}
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
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
              <div className="row">
                <div className="col-sm-10">
                  <span className="gold">Variety</span>
                </div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setTypeModifiable(true);
                      setDetailsModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{form.plantType}</span>
            </div>
          </>
        )}
        <div
          className={showDetailsStatus ? "text-center mt-3" : "hidden-field"}
        >
          <span>{detailsStatus}</span>
        </div>
        <div
          className={detailsModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Apply changes
          </button>
        </div>
      </form>
      <form
        className="m-auto mt-5 px-2 d-lg-none"
        onSubmit={(e) => {
          handleSubmit(e, setDetailsStatus, setShowDetailsStatus);
        }}
      >
        {nameModifiable ? (
          <>
            <label className="form-label gold" htmlFor="plantName">
              Name
            </label>
            <input
              className="form-control"
              name="plantName"
              type="text"
              value={form.plantName}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <div className="container p-0">
              <div className="row">
                <div className="col-sm-10">
                  <span className="gold">Name</span>
                </div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setNameModifiable(true);
                      setDetailsModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{form.plantName}</span>
            </div>
          </>
        )}
        {typeModifiable ? (
          <>
            <label className="form-label gold mt-2" htmlFor="plantType">
              Variety
            </label>
            <select
              className="form-control"
              name="plantType"
              onChange={handleChange}
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
          </>
        ) : (
          <>
            <div className="container p-0 mt-2">
              <div className="row">
                <div className="col-sm-10">
                  <span className="gold">Variety</span>
                </div>
                <div className="col-sm-2 text-end">
                  <FontAwesomeIcon
                    className="gold light-gold-hover"
                    icon={faPen}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setTypeModifiable(true);
                      setDetailsModifiable(true);
                    }}
                  ></FontAwesomeIcon>
                </div>
              </div>
            </div>
            <div className="mt-1 py-1 overflow-hidden gold-border">
              <span className="ms-1">{form.plantType}</span>
            </div>
          </>
        )}
        <div
          className={showDetailsStatus ? "text-center mt-3" : "hidden-field"}
        >
          <span>{detailsStatus}</span>
        </div>
        <div
          className={detailsModifiable ? "text-center mt-3" : "hidden-field"}
        >
          <button className="btn btn-primary" type="submit">
            Apply changes
          </button>
        </div>
      </form>
    </section>
  );
}
