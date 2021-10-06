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
      <div className="text-center mt-3">
        <span className="text-center gold">
          You can now login with you new password.
        </span>
        <Link className="ms-1" key="login" to="/login">
          <button className="btn btn-primary">Login</button>
        </Link>
      </div>
    </section>
  );
}
