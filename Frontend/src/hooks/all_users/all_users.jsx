import React, { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import "./all_users.css";

export default function AllUsers(props) {
  const { getLogin, wideView } = props;

  // Constant for the lazy-loaded dynamic import of the Pagination hook. This enables good code-splitting and faster page loading.
  const Pagination = lazy(() => import("../pagination/pagination"));

  // State variable for Demeter's users. Initially set to 'Loading users...' while the users are being fetched from the backend.
  const [users, setUsers] = useState("Loading users...");

  // useEffect hook that runs a single time when this component loads. Sets the title of the web page appropriately, then performs a check on whether the user is logged in and an administrator on the UI. If not, the user is returned to the root path.
  // Otherwise, a GET request is made to Users admin endpoint of the backend. If this request is unsuccessful, the users state variable is set to an appropriate error message.
  // Otherwise, the users state variable is updated with the sorted value of the returned users array.
  useEffect(() => {
    document.title = "Users | Demeter - The plant meter";

    const login = getLogin();
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
        <div
          className={wideView ? "text-center mt-3" : "text-center mt-3 mb-2"}
          style={{ color: "white" }}
        >
          {users}
        </div>
      ) : (
        <Suspense fallback={<div></div>}>
          <Pagination
            items={users}
            itemID="id"
            heading1="Email"
            heading2="Role"
            imageCol={false}
            itemTitle1="email"
            itemTitle2="role"
            path="user"
            wideView={wideView}
          ></Pagination>
        </Suspense>
      )}
    </section>
  );
}
