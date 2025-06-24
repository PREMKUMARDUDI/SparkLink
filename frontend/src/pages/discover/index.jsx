import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function DiscoverPage() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!authState.all_profiles_fetched) {
        await dispatch(getAllUsers());
        await dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      }
    };
    fetchData();
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h4 style={{ marginBottom: "0.5rem" }}>Discover</h4>

          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users
                .filter(
                  (user) =>
                    authState.user?.userId.username !== user.userId.username
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
                        <h2>{user.userId.name}</h2>
                        <p style={{ color: "gray", fontSize: "14px" }}>
                          {user.userId.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
