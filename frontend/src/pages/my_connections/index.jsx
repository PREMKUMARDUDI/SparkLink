import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import {
  acceptConnectionRequest,
  getSentConnectionRequests,
  getReceivedConnectionRequests,
} from "@/config/redux/action/authAction";

export default function MyConnectionsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchConnections = async () => {
      await dispatch(
        getReceivedConnectionRequests({ token: localStorage.getItem("token") }),
      );
      await dispatch(
        getSentConnectionRequests({ token: localStorage.getItem("token") }),
      );
    };
    fetchConnections();
  }, []);

  useEffect(() => {
    if (authState.receivedConnectionsRequests.length !== 0) {
      console.log("My Connections:", authState.receivedConnectionsRequests);
    }
  }, [authState.receivedConnectionsRequests]);

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
          <h4 style={{ marginBottom: "0.5rem", marginTop: "0.65rem" }}>
            My Connections
          </h4>

          {authState.receivedConnectionsRequests.filter((connection) => {
            return connection.status_accepted === true;
          }).length === 0 &&
            authState.sentConnectionsRequests.filter((connection) => {
              return connection.status_accepted === true;
            }).length === 0 && (
              <div style={{ marginTop: "0.5rem", color: "gray" }}>
                <h3>No Connection in Network</h3>
              </div>
            )}

          <div className={styles.allAcceptedConnectionRequests}>
            {authState.receivedConnectionsRequests.length !== 0 &&
              authState.receivedConnectionsRequests
                .filter((connection) => {
                  return connection.status_accepted === true;
                })
                .map((connection, index) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(
                          `/view_profile/${connection.userId.username}`,
                        );
                      }}
                      className={styles.userCard}
                      key={index}
                    >
                      <div className={styles.userCard_left}>
                        <img
                          className={styles.userCard_image}
                          src={`${BASE_URL}/${connection.userId.profilePicture}`}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if default also fails
                            e.target.src = `/images/user-placeholder.jpg`; // Path to your fallback image
                          }}
                        />
                        <div className={styles.userInfo}>
                          <h2>{connection.userId.name}</h2>
                          <p style={{ color: "gray", fontSize: "14px" }}>
                            {connection.userId.username}
                          </p>
                        </div>
                      </div>
                      <div className={styles.userCard_right}></div>
                    </div>
                  );
                })}

            {authState.sentConnectionsRequests.length !== 0 &&
              authState.sentConnectionsRequests
                .filter((connection) => {
                  return connection.status_accepted === true;
                })
                .map((connection, index) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(
                          `/view_profile/${connection.connectionId.username}`,
                        );
                      }}
                      className={styles.userCard}
                      key={index}
                    >
                      <div className={styles.userCard_left}>
                        <img
                          className={styles.userCard_image}
                          src={`${BASE_URL}/${connection.connectionId.profilePicture}`}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if default also fails
                            e.target.src = `/images/user-placeholder.jpg`; // Path to your fallback image
                          }}
                        />
                        <div className={styles.userInfo}>
                          <h2>{connection.connectionId.name}</h2>
                          <p style={{ color: "gray", fontSize: "14px" }}>
                            {connection.connectionId.username}
                          </p>
                        </div>
                      </div>
                      <div className={styles.userCard_right}></div>
                    </div>
                  );
                })}
          </div>

          <h4 style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
            Connection Requests
          </h4>

          {authState.receivedConnectionsRequests.filter((connection) => {
            return connection.status_accepted === null;
          }).length === 0 && (
            <div style={{ color: "gray" }}>
              <h3>No Connection Request Pending</h3>
            </div>
          )}

          <div className={styles.allConnectionRequests}>
            {authState.receivedConnectionsRequests.length !== 0 &&
              authState.receivedConnectionsRequests
                .filter((connection) => {
                  return connection.status_accepted === null;
                })
                .map((connection, index) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(
                          `/view_profile/${connection.userId.username}`,
                        );
                      }}
                      className={styles.userCard}
                      key={index}
                    >
                      <div className={styles.userCard_left}>
                        <img
                          className={styles.userCard_image}
                          src={`${BASE_URL}/${connection.userId.profilePicture}`}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if default also fails
                            e.target.src = `/images/user-placeholder.jpg`; // Path to your fallback image
                          }}
                        />
                        <div className={styles.userInfo}>
                          <h2>{connection.userId.name}</h2>
                          <p style={{ color: "gray", fontSize: "14px" }}>
                            {connection.userId.username}
                          </p>
                        </div>
                      </div>
                      <div className={styles.userCard_right}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              acceptConnectionRequest({
                                token: localStorage.getItem("token"),
                                connectionId: connection._id,
                                action_type: "accept",
                              }),
                            );
                          }}
                          className={styles.acceptButton}
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              acceptConnectionRequest({
                                token: localStorage.getItem("token"),
                                connectionId: connection._id,
                                action_type: "reject",
                              }),
                            );
                          }}
                          className={styles.rejectButton}
                        >
                          Reject
                        </button>
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
