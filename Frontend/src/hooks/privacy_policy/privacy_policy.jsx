import React, { useEffect } from "react";
import "./privacy_policy.css";

export default function PrivacyPolicy(props) {
  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately.
  useEffect(() => {
    document.title = "Privacy policy | Demeter - The plant meter";
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="gold text-center">Privacy policy</h1>
      <div
        className={
          props.wideView
            ? "text-center w-50 m-auto mt-3"
            : "text-center mt-3 mx-3"
        }
      >
        <p>
          This following document sets forth the Privacy Policy for the Demeter
          application. ACME Smart Plants is committed to providing you with the
          best possible customer service experience. ACME Smart Plants is bound
          by the Privacy Act 1988 (Cth), which sets out a number of principles
          concerning the privacy of individuals.
        </p>
        <h3 className="gold text-center">
          Collection of your personal information
        </h3>
        <p>
          For full access to the features of the Demeter application you are
          required to submit personally identifiable information. This may
          include but not limited to a unique username and password, or provide
          sensitive information in the recovery of your lost password.
        </p>
        <h3 className="gold text-center">
          Sharing of your personal information
        </h3>
        <p>
          We may occasionally hire other companies to provide services on our
          behalf, including but not limited to handling customer support
          enquiries, processing transactions or customer freight shipping. Those
          companies will be permitted to obtain only the personal information
          they need to deliver the service. ACME Smart Plants takes reasonable
          steps to ensure that these organisations are bound by confidentiality
          and privacy obligations in relation to the protection of your personal
          information.
        </p>
        <h3 className="gold text-center">Use of your personal information</h3>
        <p>
          For each user of our application, we expressively collect the
          following non-personally identifiable information, including but not
          limited to browser type, version and language, operating system, pages
          viewed while browsing the Site, page access times and referring
          website address. This collected information is used solely internally
          for the purpose of gauging visitor traffic, trends and delivering
          personalized content to you while you are at this Site. From time to
          time, we may use customer information for new, unanticipated uses not
          previously disclosed in our privacy notice. If our information
          practices change at some time in the future we will use for these new
          purposes only, data collected from the time of the policy change
          forward will adhere to our updated practices.
        </p>
        <h3 className="gold text-center">Changes to this Privacy Policy</h3>
        <p>
          ACME Smart Plants reserves the right to make amendments to this
          Privacy Policy at any time. If you have objections to the Privacy
          Policy, you should not access or use the Site.
        </p>
        <h3 className="gold text-center">
          Accessing your personal information
        </h3>
        <p>
          You have a right to access your personal information, subject to
          exceptions allowed by law. If you would like to do so, please let us
          know. You may be required to put your request in writing for security
          reasons. ACME Smart Plants reserves the right to charge a fee for
          searching for, and providing access to, your information on a per
          request basis.
        </p>
        <h3 className="gold text-center">Security</h3>
        <p>
          We value your trust in providing us your personal information, thus we
          are striving to use the best acceptable means of protecting it. But
          remember that no method of transmission over the internet, or method
          of electronic storage is 100% secure and reliable, and we cannot
          guarantee its absolute security.
        </p>
        <h3 className="gold text-center">Contacting us</h3>
        <p>
          ACME Smart Plants welcomes your comments regarding this Privacy
          Policy. If you have any questions about this Privacy Policy and would
          like further information, please contact us by any of the following
          means during business hours Monday to Friday. Post: Attn: Privacy
          Policy, ACME Smart Plants, 123 Pythia Way, Mount Olympus, Victoria
          E-mail: privacy-policy@acmesp.com.au
        </p>
      </div>
    </section>
  );
}
