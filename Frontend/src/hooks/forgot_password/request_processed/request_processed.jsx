import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./request_processed.css";

export default function RequestProcessed(props) {
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
      <div className="text-center mt-3">
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </section>
  );
}
