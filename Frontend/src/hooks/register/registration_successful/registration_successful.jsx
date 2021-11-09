import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./registration_successful.css";

export default function RegistrationSuccessful(props) {
  useEffect(() => {
    document.title = "Registration successful | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Registration successful</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        Be sure to check your email and verify your account.
      </div>
      <div
        className={
          props.wideView ? "text-center mt-3" : "text-center mt-3 mb-2"
        }
      >
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </section>
  );
}
