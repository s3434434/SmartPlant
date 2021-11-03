import React, { useEffect } from "react";
//import { Link } from "react-router-dom";
import "./terms_of_use.css";

export default function TermsOfUse(props) {
  useEffect(() => {
    document.title = "Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">
        Terms of Use
      </h1>
      <div className="text-center mt-3 w-25 m-auto">
        Please read these terms of use ("terms of use", "agreement") carefully before using www.demeter.onl website 
        (“website”, "service") operated by ACME Smart Plants ("us", 'we", "our").

        <h3>Conditions of use</h3>
        By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply 
        with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly. 
        ACME Smart Plants only grants use and access of this website, its products, and its services to those who have accepted its terms.

        <h3>Privacy policy</h3>
        Before you continue using our website, we advise you to read our privacy policy regarding our user data collection. 
        It will help you better understand our practices.

        <h3>User accounts</h3>
        As a user of this website, you may be asked to register with us and provide private information. 
        You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining 
        the safety and security of your identifying information. You are also responsible for all activities that occur 
        under your account or password.
        If you think there are any possible issues regarding the security of your account on the website, inform us immediately so we may address it accordingly.
        We reserve all rights to terminate accounts, edit or remove content and cancel orders in their sole discretion.
        
        <h3>Limitation on liability</h3>
        ACME Smart Plants is not liable for any damages that may occur to you as a result of your misuse of our website.
        ACME Smart Plants reserves the right to edit, modify, and change this Agreement any time. We shall let our users 
        know of these changes through electronic mail. This Agreement is an understanding between [name] and the user,
         and this supersedes and replaces all prior agreements regarding the use of this website.
      </div>
    </section>
  );
}