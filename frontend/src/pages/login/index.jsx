import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

  const clearInputFields = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setName("");
  };

  useEffect(() => {
    clearInputFields();
    dispatch(emptyMessage());
  }, [userLoginMethod, dispatch]);

  useEffect(() => {
    if (authState.isLoggedIn) {
      router.push("/dashboard");
    }
  }, [authState.isLoggedIn, router]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [router]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (userLoginMethod) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.cardContainer_left}>
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
                    value={name}
                    type="text"
                    placeholder="Name"
                    className={styles.inputField}
                    required
                  />
                  <input
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    value={username}
                    type="text"
                    placeholder="Username"
                    className={styles.inputField}
                    required
                  />
                </div>
              )}

              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                type="email"
                placeholder="Email"
                className={styles.inputField}
                required
              />
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
                type="password"
                placeholder="Password"
                className={styles.inputField}
                required
              />

              <button type="submit" className={styles.buttonWithOutline}>
                {userLoginMethod ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
          <div className={styles.cardContainer_right}>
            <p>
              {userLoginMethod
                ? "Don't Have an Account?"
                : "Already Have an Account?"}
            </p>

            <button
              onClick={() => {
                setUserLoginMethod(!userLoginMethod);
              }}
              style={{ color: "black", textAlign: "center" }}
              className={styles.buttonWithOutline}
            >
              {userLoginMethod ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
