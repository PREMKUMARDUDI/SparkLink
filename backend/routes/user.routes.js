import { Router } from "express";
import {
  register,
  login,
  uploadProfilePicture,
  updateUser,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfiles,
  downloadProfile,
  sendConnectionRequest,
  getSentConnectionRequests,
  getReceivedConnectionRequests,
  acceptConnectionRequest,
  getUserProfileBasedOnUsername,
} from "../controllers/user.controller.js";
import multer from "multer";
import { get } from "mongoose";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUser);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_users").get(getAllUserProfiles);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router
  .route("/user/get_sent_connection_requests")
  .get(getSentConnectionRequests);
router
  .route("/user/get_received_connection_requests")
  .get(getReceivedConnectionRequests);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router
  .route("/user/get_profile_based_on_username")
  .get(getUserProfileBasedOnUsername);

export default router;
