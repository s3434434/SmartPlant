import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./confirm_email.css";

export default function ConfirmEmail(props) {
  const { logOut, wideView } = props;
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token"),
    email = new URLSearchParams(search).get("email");

  useEffect(() => {
    document.title =
      "Email confirmation successful | Demeter - The plant meter";

    logOut();

    axios.put(
      "https://smart-plant.azurewebsites.net/api/Account/ConfirmEmail",
      {
        email: email,
        token: token,
      }
    );
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Email confirmation successful</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        Your email has been confirmed successfully.
      </div>
      <div className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}>
        <Link key="login" className="btn btn-primary" to="/login">
          Login
        </Link>
      </div>
    </section>
  );
}
