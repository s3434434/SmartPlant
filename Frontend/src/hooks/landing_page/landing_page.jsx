import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./landing_page.css";

export default function LandingPage(props) {
  useEffect(() => {
    document.title = "Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">
        Welcome to Demeter... The plant meter!
      </h1>
      <p
        className="w-50 m-auto mt-3 d-none d-xl-block"
        style={{ color: "white" }}
      >
        According to a recent study by the American Society for Horticultural
        Science, plants in an office environment can lower psychological and
        physiological stress.
        <br />
        <br />
        But taking care of a plant is not as easy as it sounds. Many plants grow
        poorly or die due to overwatering, underwatering, too much or too little
        light, being exposed to extreme temperatures, and being in an
        environment with inappropriate humidity. <br />
        <br />
        Demeter facilitates the proper care and nurturing of indoor plants by
        tracking these environmental factors and providing information on plant
        health. Demeter connects to an Arduino microprocessor connected to four
        environment sensors (temperature, humidity, light, and moisture
        content). These sensors' data is collected and presented to the user in
        an easy to view manner via a mobile friendly web application. <br />
        <br />
        Our administrative team are also available to help you gain an insight
        to your plant’s physical environment, and will provide you with advice
        and support whenever you need it. <br />
        <br />
        It's time to get your plants happier and healthier!
      </p>
      <p className="m-auto mt-3 mx-3 d-xl-none" style={{ color: "white" }}>
        According to a recent study by the American Society for Horticultural
        Science, plants in an office environment can lower psychological and
        physiological stress.
        <br />
        <br />
        But taking care of a plant is not as easy as it sounds. Many plants grow
        poorly or die due to overwatering, underwatering, too much or too little
        light, being exposed to extreme temperatures, and being in an
        environment with inappropriate humidity. <br />
        <br />
        Demeter facilitates the proper care and nurturing of indoor plants by
        tracking these environmental factors and providing information on plant
        health. Demeter connects to an Arduino microprocessor connected to four
        environment sensors (temperature, humidity, light, and moisture
        content). These sensors' data is collected and presented to the user in
        an easy to view manner via a mobile friendly web application. <br />
        <br />
        Our administrative team are also available to help you gain an insight
        to your plant’s physical environment, and will provide you with advice
        and support whenever you need it. <br />
        <br />
        It's time to get your plants happier and healthier!
      </p>
      <div className="text-center mt-4 d-none d-xl-block">
        <Link className="me-1" key="login" to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
        <Link className="ms-1" key="register" to="/register">
          <button className="btn btn-primary">Register</button>
        </Link>
      </div>
      <div className="text-center mt-4 mb-2 d-xl-none">
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
