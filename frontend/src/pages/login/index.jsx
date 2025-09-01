import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(true);

  const authState = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  // Create refs for input fields
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);
  const nameRef = useRef(null);

  // Function to clear input fields
  const clearInputFields = () => {
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (usernameRef.current) usernameRef.current.value = "";
    if (nameRef.current) nameRef.current.value = "";
  };

  useEffect(() => {
    clearInputFields();

    // Reset state variables
    setEmail("");
    setPassword("");
    setUsername("");
    setName("");

    dispatch(emptyMessage());
  }, [userLoginMethod]);

  useEffect(() => {
    if (authState.isLoggedIn) {
      router.push("/dashboard");
    }
  }, [authState.isLoggedIn]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  });

  const handleRegister = () => {
    console.log("Registering...");
    dispatch(registerUser({ username, password, email, name }));
    clearInputFields();
    setUserLoginMethod(true);
    router.push("/login");
  };

  const handleLogin = () => {
    console.log("Logging in...");
    dispatch(loginUser({ email, password }));
    clearInputFields();
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>

            <div className={styles.inputContainers}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    ref={nameRef}
                    type="text"
                    placeholder="Name"
                    className={styles.inputField}
                  />
                  <input
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    ref={usernameRef}
                    type="text"
                    placeholder="Username"
                    className={styles.inputField}
                  />
                </div>
              )}

              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                ref={emailRef}
                type="text"
                placeholder="Email"
                className={styles.inputField}
              />
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                ref={passwordRef}
                type="password"
                placeholder="Password"
                className={styles.inputField}
              />

              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  } else {
                    handleRegister();
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            <p>
              {userLoginMethod
                ? "Don't Have an Account?"
                : "Already Have an Account?"}
            </p>

            <div
              onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }}
              style={{ color: "black", textAlign: "center" }}
              className={styles.buttonWithOutline}
            >
              <p>{userLoginMethod ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
