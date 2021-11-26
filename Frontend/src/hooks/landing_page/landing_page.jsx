import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./landing_page.css";

export default function LandingPage(props) {
  const { wideView } = props;

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately.
  useEffect(() => {
    document.title = "Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Demeter - The plant meter</h1>
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
          src="https://d3utxwpu6rqzip.cloudfront.net/office_plants.webp"
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
          src="https://d3utxwpu6rqzip.cloudfront.net/plants_page.png"
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
          src="https://d3utxwpu6rqzip.cloudfront.net/sensor_data.png"
          alt="Sensor data"
        />
        <p>
          Our administrative team are available to help you gain insights into
          using Demeter, and will provide you with support whenever you need it.
        </p>
        <img
          className="landing-image m-auto mb-3"
          src="https://d3utxwpu6rqzip.cloudfront.net/support_page.png"
          alt="Support page"
        />
        <p className="text-center">
          It's time to get your plants happier and healthier!
        </p>
      </div>
      <div className={wideView ? "text-center mt-5" : "text-center mt-5 mb-2"}>
        <Link key="login" className="btn btn-primary me-1" to="/login">
          Login
        </Link>
        <Link key="register" className="btn btn-primary ms-1" to="/register">
          Register
        </Link>
      </div>
    </section>
  );
}
