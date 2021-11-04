import React, { useEffect, useState } from "react";
import axios from "axios";
import container_background from "../../assets/images/container_background.png";
import "./all_users.css";

export default function AllUsers(props) {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    document.title = "Users | Demeter - The plant meter";

    const login = props.getLogin();
    if (login !== null) {
      const { token, admin } = login;

      if (admin) {
        axios
          .get("https://smart-plant.azurewebsites.net/api/Admin/User/Role", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const sortedUsers = res.data.sort((a, b) => {
              const emailA = a.email,
                emailB = b.email;
              return emailA < emailB ? -1 : emailA > emailB ? 1 : 0;
            });

            setUsers(sortedUsers);
          })
          .catch((err) => {
            props.logOut();
            window.location.pathname = "/";
          });
      } else {
        window.location.pathname = "/";
      }
    } else {
      window.location.pathname = "/";
    }

    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <h1 className="text-center gold">Users</h1>
      {users ? (
        users.length > 0 ? (
          <div className="content-gallery mt-4">
            {users.map((user) => {
              const { email, role, id } = user;
              const userImage = container_background;

              return (
                <div
                  id={id}
                  key={id}
                  className="cg-container"
                  style={{
                    backgroundImage: `url(${userImage})`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => {
                    document.getElementById(
                      id
                    ).style.backgroundImage = `url(${userImage}), linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3))`;
                  }}
                  onMouseLeave={() => {
                    document.getElementById(
                      id
                    ).style.backgroundImage = `url(${userImage})`;
                  }}
                  onClick={(e) => {
                    window.location.pathname = `/user/${id}`;
                  }}
                >
                  <h1 style={{ cursor: "pointer" }}>{email}</h1>
                  <h2 style={{ cursor: "pointer" }}>{role}</h2>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center mt-3" style={{ color: "white" }}>
            No current users.
          </div>
        )
      ) : (
        <div className="text-center mt-3" style={{ color: "white" }}>
          Loading users...
        </div>
      )}
    </section>
  );
}
