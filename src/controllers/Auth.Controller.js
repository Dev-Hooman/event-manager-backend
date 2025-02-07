//others
import config from "../config/appconfig.js";
import {
  otpTemplate,
  passwordUpdatedTemplate,
} from "../misc/mail-templates.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//validations
import forgetPasswordValidation from "../validations/forgetPasswordValidation.js";
import verifyOtpValidation from "../validations/verifyOtpValidation.js";

//models
import OTP from "../models/Otp.js";
import User from "../models/User.js";

//utils
import { register, userLogin } from "../utils/Auth.js";
import { sendEmail } from "../utils/mail.js";
import setNewPasswordValidation from "../validations/setNewPasswordValidation.js";
import changePasswordValidation from "../validations/changePasswordValidation.js";

export async function registerUser(req, res) {
  const ALLROLES = config.auth.active_roles;

  const ROLES = new Set(ALLROLES?.map((role) => role.toLowerCase()));

  const role = req.query.role?.trim();

  if (role === "superadmin") {
    return res.status(400).json({
      error: "Invalid role. Superadmin cannot be created",
      success: false,
    });
  }

  if (!role) {
    return res.status(400).json({
      error: "Role is required",
      success: false,
    });
  }

  if (!ROLES.has(role.toLowerCase())) {
    if (ROLES.has("superadmin")) {
      ROLES.delete("superadmin");
    }

    if (!ROLES.has(role.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid role. Available roles are: ${Array.from(ROLES).join(
          ", "
        )}`,
        success: false,
      });
    }
  }

  await register(req.body, role, req, res);
}

export async function loginUser(req, res) {
  console.log("Request body: ", req.body);
  await userLogin(req.body, res);
}

export async function forgetPassword(req, res) {
  const { error } = forgetPasswordValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: error.details[0].message, success: false });

  const { email } = req.body;

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await OTP.create({ email, otp: otpCode, expiresAt: otpExpiry });

    const OTPHtmlTemplate = otpTemplate(otpCode, otpExpiry);
    let senderEmail = config.nodemailer.sender_mail;

    await sendEmail(senderEmail, email, "OTP Verification", OTPHtmlTemplate);

    res.status(200).json({ message: "OTP sent to email", success: true });
  } catch (error) {
    res.status(500).json({ error: "Error generating OTP", success: false });
  }
}

export async function verifyOtp(req, res) {
  const { error } = verifyOtpValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: error.details[0].message, success: false });

  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ error: "Invalid OTP or email", success: false });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired", success: false });
    }

    await OTP.deleteOne({ email, otp });

    const token = jwt.sign({ email }, config.auth.jwt_secret, {
      expiresIn: "5m",
    });
    res
      .status(200)
      .json({ messsage: "OTP verified successfully", success: true, token });
  } catch (error) {
    res.status(500).json({ error: "Error verifying OTP", success: false });
  }
}

export async function setPassword(req, res) {
  const { token } = req.query;

  const { newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Token is required", success: false });
  }

  try {
    const decoded = jwt.verify(token, config.auth.jwt_secret);
    const email = decoded.email;

    const { error } = setNewPasswordValidation(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0].message, success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    const passwordUpdatedHTML = passwordUpdatedTemplate(email);
    const senderEmail = config.nodemailer.sender_mail;

    await sendEmail(
      senderEmail,
      email,
      "Password Updated Successfully",
      passwordUpdatedHTML
    );

    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token", success: false });
  }
}

export async function changePassword(req, res) {
  const { error } = changePasswordValidation(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details[0].message, success: false });
  }

  const { email } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Invalid current password", success: false });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newHashedPassword;
    await user.save();

    return res.json({
      message: "Password changed successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error during password change:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
}

