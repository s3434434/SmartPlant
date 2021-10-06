import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./not_found.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Demeter - The plant meter";
  }, []);

  return (
    <section className="text-center gold">
      <h1 className="gold text-center">Page not found</h1>
      <Link key="home" to="/">
        <button className="btn btn-primary mt-5">Home</button>
      </Link>
    </section>
  );
}
