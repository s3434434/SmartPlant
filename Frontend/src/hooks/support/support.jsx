import React, { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import "./support.css";

export default function Support(props) {
  const [form, setForm] = useState({
    EmailSubject : "",
    EmailBody: "",
  });
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("none");

  useEffect(() => {
    document.title = "Support | Demeter - The plant meter";

    //props.logOut();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const input = e.target;
    const tempForm = _.cloneDeep(form);
    tempForm[input.name] = input.value;
    setForm(tempForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Please wait...");
    setShowStatus(true);

    const login = localStorage.getItem("demeter-login");
    if (login) {
      const { token } = JSON.parse(login);
      axios
        .post("https://smart-plant.azurewebsites.net/api/user/contactsupport", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {

          window.location.pathname = "/support-successful";
        })
        .catch((err) => {
          let errorMessage = "Server error. Please try again later.";
          console.log(JSON.stringify(err.response.data));
          setStatus(errorMessage);
        });

    } else {
      console.log('Not logged in somehow?... ');
      window.location.pathname = "/";
    }
  };

  return (
    <section>
      <h1 className="gold text-center">Contact Support</h1>
      <form
        className="w-25 m-auto mt-4 d-none d-lg-block"
        onSubmit={handleSubmit}
      >
        <label className="form-label gold" htmlFor="EmailSubject">
          Subject
        </label>
        <input
          className="form-control"
          name="EmailSubject"
          type="text"
          value={form.EmailSubject}
          onChange={handleChange}
          required
        />
        <label className="form-label mt-3 gold" htmlFor="EmailBody">
          Message
        </label>
        <textarea
          className="form-control"
          name="EmailBody"
          value={form.EmailBody}
          onChange={handleChange}
          required
        ></textarea>

        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </div>
      </form>

      <form className="m-auto mt-4 px-2 d-lg-none" onSubmit={handleSubmit}>
        <label className="form-label gold" htmlFor="EmailSubject">
          Subject
        </label>
        <input
          className="form-control"
          name="EmailSubject"
          type="text"
          value={form.EmailSubject}
          onChange={handleChange}
          required
        />
        <label className="form-label mt-3 gold" htmlFor="EmailBody">
          Message
        </label>
        <textarea
          className="form-control"
          name="EmailBody"
          value={form.EmailBody}
          onChange={handleChange}
          required
        ></textarea>
        
        {showStatus ? (
          <div className="text-center mt-3">
            <span>{status}</span>
          </div>
        ) : (
          <div className="hidden-field mt-3">
            <span>{status}</span>
          </div>
        )}
        <div className="text-center mt-3">
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </div>
      </form>
    </section>
  );
}