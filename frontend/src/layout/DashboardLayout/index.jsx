import React, { useEffect } from "react";
import styles from "./style.module.css";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function DashboardLayout({ children }) {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }

    dispatch(setTokenIsThere());
    const fetchData = async () => {
      if (!authState.all_profiles_fetched) {
        await dispatch(getAllUsers());
        await dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="container">
        <div className={styles.homeContainer}>
          <div className={styles.homeContainer_leftBar}>
            <div>
              <div
                onClick={() => router.push("/dashboard")}
                className={styles.sideBarOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>

                <p>Scroll</p>
              </div>
              <div
                onClick={() => router.push("/discover")}
                className={styles.sideBarOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>

                <p>Discover</p>
              </div>
              <div
                onClick={() => router.push("/my_connections")}
                className={styles.sideBarOption}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>

                <p>My Connections</p>
              </div>
            </div>
          </div>

          <div className={styles.homeContainer_feedContainer}>{children}</div>

          <div className={styles.homeContainer_extraContainer}>
            <h3>Top Profiles</h3>
            <div className={styles.allUserProfile}>
              {authState.all_profiles_fetched &&
                authState.all_users
                  .filter(
                    (user) =>
                      authState.user?.userId?.username !== user.userId.username
                  )
                  .map((user) => {
                    return (
                      <div
                        onClick={() => {
                          router.push(`/view_profile/${user.userId.username}`);
                        }}
                        key={user._id}
                        className={styles.userCard}
                      >
                        <img
                          className={styles.userCard_image}
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt="User Profile"
                        />
                        <div>
                          <p
                            style={{ fontWeight: "bold", fontSize: "1.15rem" }}
                          >
                            {user.userId.name}
                          </p>
                          <p style={{ color: "gray", fontSize: "0.75rem" }}>
                            {user.userId.username}
                          </p>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobileNavBar}>
        <div
          onClick={() => router.push("/dashboard")}
          className={styles.singleNavItemHolder_mobileView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </div>
        <div
          onClick={() => router.push("/discover")}
          className={styles.singleNavItemHolder_mobileView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <div
          onClick={() => router.push("/my_connections")}
          className={styles.singleNavItemHolder_mobileView}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
