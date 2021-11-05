import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../pagination/pagination";
import "./all_users.css";

export default function AllUsers(props) {
  const [users, setUsers] = useState("Loading users...");

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
            const foundUsers = res.data;
            if (foundUsers.length > 0) {
              const sortedUsers = foundUsers.sort((a, b) => {
                const emailA = a.email,
                  emailB = b.email;
                return emailA < emailB ? -1 : emailA > emailB ? 1 : 0;
              });
              console.log(sortedUsers);
              setUsers(sortedUsers);
            } else {
              setUsers("No current users.");
            }
          })
          .catch((err) => {
            setUsers(
              "There was an error retrieving the user data. Please try again later."
            );
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
      {typeof users === "string" ? (
        <div className="text-center mt-3" style={{ color: "white" }}>
          {users}
        </div>
      ) : (
        <Pagination
          items={users}
          itemID="id"
          heading1="Email"
          heading2="Role"
          defaultImage={null}
          itemTitle1="email"
          itemTitle2="role"
          path="user"
        ></Pagination>
      )}
    </section>
  );
}
