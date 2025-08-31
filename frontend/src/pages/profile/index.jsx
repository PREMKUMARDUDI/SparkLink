import {
  getAboutUser,
  getConnectionRequests,
  getMyConnections,
} from "@/config/redux/action/authAction";
import {
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLike,
  postComment,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdModalOpen, setIsEdModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [edInputData, setEdInputData] = useState({
    college: "",
    degree: "",
    fieldOfStudy: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e?.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e?.target;
    setEdInputData({ ...edInputData, [name]: value });
  };

  const getUserData = async () => {
    await dispatch(getAllPosts());
    await dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    await dispatch(
      getConnectionRequests({ token: localStorage.getItem("token") })
    );
    await dispatch(getMyConnections({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setUserProfile(authState.user);

    let post = postState.posts.filter((post) => {
      return post.userId.username === authState.user?.userId?.username;
    });

    setUserPosts(post);
  }, [authState.user, postState.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
      username: userProfile.userId.username,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
    router.push("/profile");
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId && (
          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.backDropContainer}>
                <div className={styles.backDrop}>
                  <label
                    htmlFor="profilePictureUpload"
                    className={styles.backDrop_overlay}
                  >
                    <p>Edit</p>
                  </label>
                  <input
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        updateProfilePicture(e.target.files[0]);
                      }
                    }}
                    style={{ opacity: "0" }}
                    type="file"
                    id="profilePictureUpload"
                  />
                  <img
                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                    alt="backdrop"
                    onError={(e) => {
                      e.target.onerror = null; // Prevents infinite loop if default also fails
                      e.target.src = `/images/user-placeholder.jpg`; // Path to your fallback image
                    }}
                  />
                </div>
              </div>

              <div className={styles.profileContainer_details}>
                <div
                  className={styles.profile_details}
                  style={{ display: "flex", gap: "0.7rem" }}
                >
                  <div style={{ flex: "0.7", paddingRight: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingInlineStart: "0.5rem",
                        width: "fit-content",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <input
                        className={styles.nameEdit}
                        type="text"
                        value={userProfile.userId.name}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            userId: {
                              ...userProfile.userId,
                              name: e.target.value,
                            },
                          });
                        }}
                      />
                      <input
                        className={styles.usernameEdit}
                        type="text"
                        value={userProfile.userId.username}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            userId: {
                              ...userProfile.userId,
                              username: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>

                    <div>
                      <textarea
                        value={userProfile.bio}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            bio: e.target.value,
                          });
                        }}
                        rows={Math.max(
                          3,
                          Math.ceil(userProfile.bio.length / 35)
                        )}
                      ></textarea>
                    </div>
                  </div>
                  <div style={{ flex: "0.3" }}>
                    <h4>Recent Activity</h4>
                    {userPosts.map((post, index) => {
                      return (
                        index < 2 && (
                          <div key={post._id} className={styles.postCard}>
                            <div className={styles.card}>
                              <div className={styles.card_profileContainer}>
                                {post.media !== "" ? (
                                  <img
                                    src={`${BASE_URL}/${post.media}`}
                                    alt="post"
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "3.4rem",
                                      height: "2.4rem",
                                      backgroundColor: "rgb(213, 213, 213)",
                                    }}
                                  ></div>
                                )}
                              </div>

                              <p style={{ fontSize: "0.7rem" }}>{post.body}</p>
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.aboutUserContainer}>
                <div className={styles.workHistory}>
                  <h4>Work History</h4>

                  <div className={styles.workHistoryContainer}>
                    {(Array.isArray(userProfile?.pastWork)
                      ? userProfile.pastWork
                      : []
                    ).map((work, index) => {
                      return (
                        <div key={index} className={styles.workHistoryCard}>
                          <p
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {work.company} - {work.position}
                          </p>

                          <p>{work.years}+ years</p>
                        </div>
                      );
                    })}

                    <div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className={styles.addWorkButton}
                      >
                        Add Work
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.workHistory}>
                  <h4>Education</h4>

                  <div className={styles.workHistoryContainer}>
                    {(Array.isArray(userProfile?.education)
                      ? userProfile.education
                      : []
                    ).map((edu, index) => {
                      return (
                        <div key={index} className={styles.workHistoryCard}>
                          <p
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {edu.college} - {edu.degree}
                          </p>

                          <p>{edu.fieldOfStudy}</p>
                        </div>
                      );
                    })}

                    <div>
                      <button
                        onClick={() => setIsEdModalOpen(true)}
                        className={styles.addWorkButton}
                      >
                        Add Education
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {userProfile !== authState.user && (
                <div
                  onClick={() => {
                    updateProfileData();
                    router.push("/profile");
                  }}
                  className={styles.profileUpdateButton}
                >
                  Update Profile
                </div>
              )}

              <hr />

              <div className={styles.allPostsContainer}>
                <h2>Posts</h2>
                {userPosts.length === 0 && (
                  <h2 style={{ color: "gray" }}>No Posts Found</h2>
                )}
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.singleCard_profileContainer}>
                        <img
                          onClick={() => {
                            router.push(
                              `/view_profile/${post.userId.username}`
                            );
                          }}
                          style={{ cursor: "pointer" }}
                          className={styles.userProfile}
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          alt=""
                          onError={(e) => {
                            e.target.onerror = null; // Prevents infinite loop if default also fails
                            e.target.src = `/images/user-placeholder.jpg`; // Path to your fallback image
                          }}
                        />
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: "1.2rem",
                              justifyContent: "space-between",
                            }}
                          >
                            <p
                              onClick={() => {
                                router.push(
                                  `/view_profile/${post.userId.username}`
                                );
                              }}
                              style={{
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              {post.userId.name}
                            </p>

                            {post.userId._id ===
                              authState.user?.userId?._id && (
                              <div
                                onClick={async () => {
                                  await dispatch(
                                    deletePost({ postId: post._id })
                                  );
                                  await dispatch(getAllPosts());
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  style={{ height: "1.2em", color: "red" }}
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p
                            onClick={() => {
                              router.push(
                                `/view_profile/${post.userId.username}`
                              );
                            }}
                            style={{
                              color: "grey",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                          >
                            {post.userId.username}
                          </p>
                          <p style={{ paddingTop: "0.5rem" }}>{post.body}</p>

                          {post.media !== "" ? (
                            <div className={styles.singleCard_image}>
                              <img src={`${BASE_URL}/${post.media}`} alt="" />
                            </div>
                          ) : (
                            <></>
                          )}

                          <div className={styles.optionsContainer}>
                            <div
                              onClick={async () => {
                                await dispatch(
                                  incrementPostLike({ postId: post._id })
                                );
                                await dispatch(getAllPosts());
                              }}
                              className={styles.singleOption_optionsContainer}
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
                                  d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                />
                              </svg>
                              <p>{post.likes}</p>
                            </div>
                            <div
                              onClick={async () => {
                                await dispatch(
                                  getAllComments({ postId: post._id })
                                );
                              }}
                              className={styles.singleOption_optionsContainer}
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
                                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                />
                              </svg>
                            </div>
                            <div
                              onClick={() => {
                                const text = encodeURIComponent(post.body);
                                const url =
                                  encodeURIComponent("apnacollege.in");

                                const twitterURL = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                                window.open(twitterURL, "_blank");
                              }}
                              className={styles.singleOption_optionsContainer}
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
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {postState.postId === post._id && (
                        <div
                          onClick={async () => {
                            await dispatch(resetPostId());
                          }}
                          className={styles.commentsContainer}
                        >
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={styles.allCommentsContainer}
                          >
                            {postState.comments.length === 0 ? (
                              <h2 style={{ color: "gray" }}>No Comments</h2>
                            ) : (
                              <div className={styles.allComments}>
                                {postState.comments.map((comment, index) => {
                                  return (
                                    <div
                                      className={styles.singleComment}
                                      key={comment._id}
                                    >
                                      <div
                                        className={
                                          styles.singleComment_profileContainer
                                        }
                                      >
                                        <img
                                          src={`${BASE_URL}/${comment.userId.profilePicture}`}
                                          alt=""
                                          style={{
                                            width: "2.5rem",
                                            height: "2.5rem",
                                            borderRadius: "50%",
                                          }}
                                          onError={(e) => {
                                            e.target.onerror = null; // Prevents infinite loop if default also fails
                                            e.target.src = `/images/user-placeholder.jpg`; // Path to your fallback image
                                          }}
                                        />
                                        <div>
                                          <p
                                            style={{
                                              fontWeight: "bold",
                                              fontSize: "1.2rem",
                                            }}
                                          >
                                            {comment.userId.name}
                                          </p>
                                          <p
                                            style={{
                                              color: "gray",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {comment.userId.username}
                                          </p>
                                        </div>
                                      </div>
                                      <p
                                        style={{
                                          paddingInlineStart: "4.0rem",
                                        }}
                                      >
                                        {comment.body}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className={styles.postCommentContainer}>
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                              />
                              <div
                                onClick={async () => {
                                  await dispatch(
                                    postComment({
                                      post_id: postState.postId,
                                      body: commentText,
                                    })
                                  );
                                  await dispatch(
                                    getAllComments({
                                      postId: postState.postId,
                                    })
                                  );
                                  setCommentText("");
                                }}
                                className={
                                  styles.postCommentContainer_commentBtn
                                }
                              >
                                <p>Comment</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className={styles.formContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.inputModalContainer}
            >
              <input
                onChange={(e) => {
                  handleWorkInputChange(e);
                }}
                name="company"
                type="text"
                placeholder="Company"
                className={styles.inputField}
              />
              <input
                onChange={(e) => {
                  handleWorkInputChange(e);
                }}
                name="position"
                type="text"
                placeholder="Position"
                className={styles.inputField}
              />
              <input
                onChange={(e) => {
                  handleWorkInputChange(e);
                }}
                name="years"
                type="number"
                placeholder="Years"
                className={styles.inputField}
              />

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...userProfile.pastWork, inputData],
                  });
                  setIsModalOpen(false);
                }}
                className={styles.profileUpdateButton}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        {isEdModalOpen && (
          <div
            onClick={() => setIsEdModalOpen(false)}
            className={styles.formContainer}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.inputModalContainer}
            >
              <input
                onChange={(e) => {
                  handleEducationInputChange(e);
                }}
                name="college"
                type="text"
                placeholder="College"
                className={styles.inputField}
              />
              <input
                onChange={(e) => {
                  handleEducationInputChange(e);
                }}
                name="degree"
                type="text"
                placeholder="Degree"
                className={styles.inputField}
              />
              <input
                onChange={(e) => {
                  handleEducationInputChange(e);
                }}
                name="fieldOfStudy"
                type="text"
                placeholder="Field of Study"
                className={styles.inputField}
              />

              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...userProfile.education, edInputData],
                  });
                  setIsEdModalOpen(false);
                }}
                className={styles.profileUpdateButton}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
