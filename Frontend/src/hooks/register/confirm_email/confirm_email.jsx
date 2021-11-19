import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./confirm_email.css";

export default function ConfirmEmail(props) {
  const { logOut, wideView } = props;
  // Sets constants for the 'token' and 'email' URL parameters.
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token"),
    email = new URLSearchParams(search).get("email");

  // State variable for whether the email was confirmed successfully. Initially set to null while the backend request is made.
  const [confirmationSuccessful, setConfirmationSuccessful] = useState(null);

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, ensures the user is logged out on the UI, and then makes a PUT request to the backend's ConfirmEmail endpoint.
  // If this request is successful, the web page title is updated appropriately and the confirmationSuccessful state variable is set to true. Otherwise, the confirmationSuccessful state variable is set to false.
  useEffect(() => {
    document.title = "Demeter - The plant meter";

    logOut();

    axios
      .put("https://smart-plant.azurewebsites.net/api/Account/ConfirmEmail", {
        email: email,
        token: token,
      })
      .then((res) => {
        document.title =
          "Email confirmation successful | Demeter - The plant meter";

        setConfirmationSuccessful(true);
      })
      .catch((err) => {
        setConfirmationSuccessful(false);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      {confirmationSuccessful !== null ? (
        <>
          <h1 className="gold text-center">
            {confirmationSuccessful
              ? "Email confirmation successful"
              : "Server error"}
          </h1>
          <div className="text-center mt-3">
            {confirmationSuccessful ? (
              <span>Your email has been confirmed successfully.</span>
            ) : (
              <span>Server error. Please try again later.</span>
            )}
          </div>
          <div
            className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
          >
            {confirmationSuccessful ? (
              <Link key="login" className="btn btn-primary" to="/login">
                Login
              </Link>
            ) : (
              <Link key="home" className="btn btn-primary" to="/">
                Home
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="text-center mt-3" style={{ color: "white" }}>
          Confirming email...
        </div>
      )}
    </section>
  );
}
