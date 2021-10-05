import React, { useEffect } from "react";
import "./notfound.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found";
  }, []);

  return <section id="notfound">Page not found.</section>;
}
