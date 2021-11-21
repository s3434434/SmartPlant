import React from "react";
import { Navigate } from "react-router-dom";
import "./home.css";

export default function Home(props) {
  // Defines a constant based on calling the prop 'getLogin' function.
  const login = props.getLogin();

  return login !== null ? (
    login.admin ? (
      <Navigate to="/users" />
    ) : (
      <Navigate to="/plants" />
    )
  ) : (
    <Navigate to="/landing" />
  );
}
