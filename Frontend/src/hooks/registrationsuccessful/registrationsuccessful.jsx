import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./landingpage.css";

export default function RegistrationSuccessful(props) {
  useEffect(() => {
    document.title = "Registration successful | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Registration successful</h1>
      <div className="text-center mt-3">
        <span className="gold text-center">
          Be sure to check your email and verify your account.
        </span>
        <Link className="ms-1" key="landing-page" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </section>
  );
}
