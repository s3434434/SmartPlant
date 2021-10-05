import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./landingpage.css";

export default function LandingPage(props) {
  useEffect(() => {
    document.title = "Demeter: The Plant Meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section id="landing">
      <h1 className="gold text-center">
        Welcome to Demeter... The plant meter!
      </h1>
      <div className="text-center mt-3">
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
