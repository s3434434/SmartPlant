import React, { useEffect } from "react";
import "./not_found.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page not found | Demeter - The plant meter";
  }, []);

  return <section className="text-center gold">Page not found.</section>;
}
