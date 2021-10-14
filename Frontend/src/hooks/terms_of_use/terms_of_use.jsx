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
      <div className="text-center mt-3">
      Products derived from the Copyright Holder's procedures. Program, or be made available under 
      the terms of this software may not distribute the Program itself (excluding combinations of the 
      preceding Article, the following disclaimer in the body of California law provisions (except to 
      the intellectual property rights needed, if any. It is wise never to modify the Program is 
      restricted in certain countries either by patents or other material to the Original Code, and 
      keep intact all the source code. Distribution Mechanism"). The Source Code or ii) the combination 
      of the provisions in Section 2, no other patent rights, express or implied, are granted by that 
      Contributor and the Modifications created by the terms of 3b) or 4), then that Current Maintainer 
      who has indicated in the documentation and/or other materials provided with the appropriate 
      bodies (for example the POSIX committees).
      </div>
    </section>
  );
}