import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./logout.css";

export default function Logout(props) {
  const { getLogin, logOut, wideView } = props;

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user in logged in. If so, the user is logged out on the UI. Otherwise, the user is returned to the root path.
  useEffect(() => {
    document.title = "Logout successful | Demeter - The plant meter";

    if (getLogin() !== null) {
      logOut();
    } else {
      window.location.pathname = "/";
    }
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
