import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import { createSecretToken } from "../util/SecretToken.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";

const convertUserDataToPDF = async (userData) => {
  const doc = new PDFDocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.moveDown(8);
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();

  return outputPath;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });

    await profile.save();

    res.status(201).json({ message: "User Created!" });

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials!" });

    const token = createSecretToken(user._id);

    user.token = token;
    await user.save();

    setTimeout(async () => {
      try {
        user.token = null; // or undefined, depending on your preference
        await user.save();
        console.log(`Token removed for user ${user._id}`);
      } catch (err) {
        console.error(`Failed to remove token: ${err.message}`);
      }
    }, 1 * 24 * 60 * 60 * 1000);

    res.status(200).json({
      message: "User Logged In Successfully!",
      success: true,
      token: token,
    });

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found!" });

    user.profilePicture = req.file.filename;

    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully!",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(400).json("User already exists!");
    }

    Object.assign(user, newUserData);

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully!",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ Profile: userProfile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const profile_to_update = await Profile.findOne({
      userId: user._id,
    });

    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();

    return res.json({ message: "Profile Updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name email username profilePicture"
    );

    if (!profiles)
      return res.status(404).json({ message: "No profiles found!" });

    return res.json({ Profiles: profiles });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const downloadProflie = async (req, res) => {
  const user_id = req.query.id;
  const userProfile = await Profile.findOne({
    userId: user_id,
  }).populate("userId", "name email username profilePicture");

  let outputPath = await convertUserDataToPDF(userProfile);

  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token: token });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found!" });
    }

    const rejectedRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
      status_accepted: false,
    });

    if (rejectedRequest) {
      rejectedRequest.status_accepted = null; // Reset the status to null
      await rejectedRequest.save();
    } else {
      const existingRequest = await ConnectionRequest.findOne({
        userId: user._id,
        connectionId: connectionUser._id,
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already sent!" });
      }

      const request = new ConnectionRequest({
        userId: user._id,
        connectionId: connectionUser._id,
      });

      await request.save();
    }

    return res.json({ message: "Request Sent!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getConnectionRequests = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connections = await ConnectionRequest.find({
      userId: user._id,
    }).populate("connectionId", "name email username profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate("userId", "name email username profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if (!connection) {
      return res.status(404).json({ message: "Connection request not found!" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();

    return res.json({ message: "Connection request updated!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserProfileBasedOnUsername = async (req, res) => {
  try {
    const { username } = req.query;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const profile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture"
    );

    return res.json({ profile });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
