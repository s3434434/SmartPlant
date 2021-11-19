import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./logout.css";

export default function Logout(props) {
  const { logOut, wideView } = props;

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately and ensures the user is logged out on the UI.
  useEffect(() => {
    document.title = "Logout successful | Demeter - The plant meter";

    logOut();
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">You have been logged out.</h1>
      <div className={wideView ? "text-center mt-5" : "text-center mt-5 mb-2"}>
        <Link key="home" className="btn btn-primary" to="/">
          Home
        </Link>
      </div>
    </section>
  );
}
