import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./plant_added.css";

export default function PlantAdded(props) {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    document.title = "Plant added successfully | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Plant added successfully</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        Your plant has been added successfully. Your Arduino token is
        <span className="gold"> {decodeURIComponent(token)}</span>.
      </div>
      <div
        className={
          props.wideView ? "text-center mt-3" : "text-center mt-3 mb-2"
        }
      >
        <Link key="plants" to="/plants">
          <button className="btn btn-primary">Plants</button>
        </Link>
      </div>
    </section>
  );
}
