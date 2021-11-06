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
      <div className="text-center mt-5 d-none d-xl-block">
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
      <div className="text-center mt-5 mb-2 d-xl-none">
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </section>
  );
}
