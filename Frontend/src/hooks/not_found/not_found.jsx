import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./not_found.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Demeter - The plant meter";
  }, []);

  return (
    <section className="text-center gold">
      <div className="text-center mt-3">
        <span className="text-center gold">Page not found.</span>
      </div>
      <Link key="home" to="/">
        <button className="btn btn-primary mt-3">Home</button>
      </Link>
    </section>
  );
}
