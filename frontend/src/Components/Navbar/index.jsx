import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
import { BASE_URL } from "@/config";

export default function NavbarComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer", color: "#526a6e" }}
          onClick={() => {
            router.push("/");
          }}
        >
          SparkLink
        </h1>

        <div className={styles.navBarOptionContainer}>
          {authState.profileFetched && (
            <div style={{ display: "flex", gap: "1rem" }}>
              {/* <p>Hey, {authState.user?.userId?.name}</p>
              <p
                onClick={() => {
                  router.push("/profile");
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                Profile
              </p> */}
              {authState.user?.userId?.profilePicture && (
                <img
                  onClick={() => {
                    router.push("/profile");
                  }}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    border: "2px solid #526a6e",
                    cursor: "pointer",
                    zIndex: 100,
                  }}
                  src={`${BASE_URL}/${authState.user?.userId?.profilePicture}`}
                  alt="Profile"
                />
              )}
              <p
                onClick={async () => {
                  localStorage.removeItem("token");
                  await dispatch(reset());
                  router.push("/login");
                }}
                style={{ fontWeight: "bold", cursor: "pointer" }}
              >
                {/* Logout */}
                <svg
                  style={{
                    cursor: "pointer",
                    width: "1.8rem",
                    height: "1.8rem",
                    color: "#526a6e",
                  }}
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
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                  />
                </svg>
              </p>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
