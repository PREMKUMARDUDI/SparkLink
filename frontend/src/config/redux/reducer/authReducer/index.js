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
        state.isError = false;
        state.message = "Knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
        state.isTokenThere = true;
        state.message = "";
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
        state.isError = false;
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
        state.user = action.payload.Profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.Profiles;
      })
      .addCase(getSentConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.sentConnectionsRequests = action.payload.connections;
      })
      .addCase(getSentConnectionRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getReceivedConnectionRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.receivedConnectionsRequests = action.payload.connections;
      })
      .addCase(getReceivedConnectionRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      });
  },
});

export const { reset, emptyMessage, setTokenIsThere, logout } =
  authSlice.actions;

export default authSlice.reducer;
