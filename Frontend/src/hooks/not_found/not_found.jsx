import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./not_found.css";

export default function NotFound(props) {
  useEffect(() => {
    document.title = "Page not found | Demeter - The plant meter";
  }, []);

  return (
    <section className="text-center gold">
      <h1 className="gold text-center">Page not found</h1>
      <div
        className={
          props.wideView ? "text-center mt-5" : "text-center mt-5 mb-2"
        }
      >
        <Link key="home" className="btn btn-primary" to="/">
          Home
        </Link>
      </div>
    </section>
  );
}
