import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./request_processed.css";

export default function RequestProcessed(props) {
  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately.
  useEffect(() => {
    document.title = "Request processed | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Request processed</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        If an account with that email exists you will receive a password reset
        link shortly.
      </div>
      <div
        className={
          props.wideView ? "text-center mt-3" : "text-center mt-3 mb-2"
        }
      >
        <Link key="home" className="btn btn-primary" to="/">
          Home
        </Link>
      </div>
    </section>
  );
}
