import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import office_plants from "../../assets/images/office_plants.webp";
import plants_page from "../../assets/images/plants_page.png";
import sensor_data from "../../assets/images/sensor_data.png";
import support_page from "../../assets/images/support_page.png";
import "./landing_page.css";

export default function LandingPage(props) {
  const { wideView } = props;
  useEffect(() => {
    document.title = "Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">
        Welcome to Demeter... The plant meter!
      </h1>
      <div
        className={
          wideView
            ? "w-50 m-auto mt-3 text-center"
            : "m-auto mt-3 mx-3 text-center"
        }
      >
        <p>
          According to a recent study by the American Society for Horticultural
          Science, plants in an office environment can lower psychological and
          physiological stress.
        </p>
        <img
          className="landing-image m-auto mb-3"
          src={office_plants}
          alt="Office plants"
        />
        <p>
          But taking care of a plant is not as easy as it sounds. Many plants
          grow poorly or die due to overwatering, underwatering, too much or too
          little light, being exposed to extreme temperatures, or being in an
          environment with inappropriate humidity. Demeter facilitates the
          proper care and nurturing of indoor plants by tracking these
          environmental factors and providing information on plant health.
        </p>
        <img
          className="landing-image m-auto mb-3"
          src={plants_page}
          alt="Plants page"
        />
        <p>
          Demeter connects to an Arduino microprocessor with four environmental
          sensors (temperature, light, moisture content and humidity). These
          sensors collect data and present it to you in an easy to view manner
          via a mobile friendly web application.
        </p>
        <img
          className="landing-image m-auto mb-3"
          src={sensor_data}
          alt="Sensor data"
        />
        <p>
          Our administrative team are available to help you gain insights into
          using Demeter, and will provide you with support whenever you need it.
        </p>
        <img
          className="landing-image m-auto mb-3"
          src={support_page}
          alt="Support page"
        />
        <p className="text-center">
          It's time to get your plants happier and healthier!
        </p>
      </div>
      <div className={wideView ? "text-center mt-5" : "text-center mt-5 mb-2"}>
        <Link className="me-1" key="login" to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
        <Link className="ms-1" key="register" to="/register">
          <button className="btn btn-primary">Register</button>
        </Link>
      </div>
    </section>
  );
}
