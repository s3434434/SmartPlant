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
      <h1 className="gold text-center">You have been logged out.</h1>
      <div className="text-center mt-5">
        <Link key="home" to="/">
          <button className="btn btn-primary">Home</button>
        </Link>
      </div>
    </section>
  );
}
