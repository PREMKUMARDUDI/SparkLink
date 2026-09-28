import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getSentConnectionRequests,
  getReceivedConnectionRequests,
  loginUser,
  registerUser,
} from "../../action/authAction/index.js";

const initialState = {
  isError: false,
  isSuccess: false,
  isLoading: false,
  isLoggedIn: false,
  isTokenThere: false,
  message: "",
  user: undefined,
  profileFetched: false,
  all_users: [],
  all_profiles_fetched: false,
  sentConnectionsRequests: [],
  receivedConnectionsRequests: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      return initialState;
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isTokenThere = false;
      state.isLoggedIn = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.isTokenThere = true;
        state.message = action.payload?.message || "Login is successfull!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.isLoggedIn = false;
        state.message = action.payload?.message || "Login failed!";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = false;
        state.message = "Registration is successful, Please Login!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload?.message || "Registration failed!";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.profileFetched = true;
        state.message = "Profile fetched successfully!";
        state.user = action.payload.Profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "All users fetched successfully!";
        state.all_profiles_fetched = true;
        state.all_users = action.payload.Profiles;
      })
      .addCase(getSentConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Sent connection requests fetched successfully!";
        state.sentConnectionsRequests = action.payload.connections;
      })
      .addCase(getSentConnectionRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload?.message ||
          "Fetching of Sent connection requests failed!";
      })
      .addCase(getReceivedConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = "Received connection requests fetched successfully!";
        state.receivedConnectionsRequests = action.payload.connections;
      })
      .addCase(getReceivedConnectionRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message =
          action.payload?.message ||
          "Fetching of Received connection requests failed!";
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere, logout } =
  authSlice.actions;

export default authSlice.reducer;
