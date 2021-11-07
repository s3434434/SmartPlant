import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./support_successful.css";

export default function SupportSuccessful(props) {
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
      <div className="text-center mt-3 d-none d-xl-block">
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
      <div className="text-center mt-3 mb-2 d-xl-none">
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </section>
  );
}
