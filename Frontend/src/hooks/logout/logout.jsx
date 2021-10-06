import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./logout.css";

export default function Logout(props) {
  useEffect(() => {
    document.title = "Logout successful | Demeter - The plant meter";

    props.logOut();
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <div className="text-center gold mt-3">
        <span className="text-center">You have been logged out.</span>
      </div>
      <Link key="home" to="/">
        <button className="btn btn-primary mt-3">Home</button>
      </Link>
    </section>
  );
}
