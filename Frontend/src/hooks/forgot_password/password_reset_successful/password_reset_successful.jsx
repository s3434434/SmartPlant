import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./password_reset_successful.css";

export default function PasswordResetSuccessful(props) {
  useEffect(() => {
    document.title = "Password reset successfully | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Password reset successfully</h1>
      <div className="text-center mt-3" style={{ color: "white" }}>
        You can now login with you new password.
      </div>
      <div
        className={
          props.wideView ? "text-center mt-3" : "text-center mt-3 mb-2"
        }
      >
        <Link key="login" className="btn btn-primary" to="/login">
          Login
        </Link>
      </div>
    </section>
  );
}
