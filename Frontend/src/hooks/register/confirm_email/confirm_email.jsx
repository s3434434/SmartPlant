import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./confirm_email.css";

export default function ConfirmEmail(props) {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token"),
    email = new URLSearchParams(search).get("email");

  useEffect(() => {
    document.title =
      "Email confirmation successful | Demeter - The plant meter";

    props.logOut();

    axios.get(
      `https://smart-plant.azurewebsites.net/api/Account/ConfirmEmail?token=${token}&email=${email}`
    );
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Email confirmation successful</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        Your email has been confirmed successfully.
      </div>
      <div className="text-center mt-3">
        <Link key="login" to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
      </div>
    </section>
  );
}
