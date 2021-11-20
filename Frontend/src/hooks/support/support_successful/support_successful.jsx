import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./support_successful.css";

export default function SupportSuccessful(props) {
  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately.
  useEffect(() => {
    document.title = "Support email sent | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Support email sent</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        Your email to Demeter's support team has been sent. We'll get back to
        you as soon as we can.
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
