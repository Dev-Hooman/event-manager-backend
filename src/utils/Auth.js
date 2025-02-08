import User from "../models/User.js";
import validateUser from "../validations/userValidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/appconfig.js";
import { photoUrlConverter } from "../misc/photoUrlConverter.js";

const ROLES = config.auth.active_roles;

export async function register(details, role, req, res) {
  console.log("Details: ", details);  

  const { error } = validateUser(req.body);
  if (error)
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });

  let emailNotRegistered = await validateEmail(details.email);
  if (!emailNotRegistered) {
    return res.status(400).json({
      message: "Email is already taken.",
      success: false,
    });
  }

  const hashedPassword = await bcrypt.hash(details.password, 12);

  const newUser = new User({
    ...details,
    password: hashedPassword,
    role: role,
  });

  const savedUser = await newUser.save();

  if (savedUser) {
    if (ROLES.includes(role)) {
      const message = `${
        role.charAt(0).toUpperCase() + role.slice(1)
      } is Created Successfully.`;
      return res.status(200).json({
        message,
        success: true,
      });
    }
  }
}

export async function userLogin(userCreds, res) {
  let { email, password } = userCreds;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
      success: false,
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "Email not found, Invalid Credentials.",
      success: true,
    });
  }

  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(403).json({
      message: "Incorrect Password.",
      success: false,
    });
  } else {
    let token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        prefferredCurrency: user.preferredCurrency,
        timeZone: user.timeZone,
        photoUrl: user.photoUrl,
        phone: user.phone,
      },
      config.auth.jwt_secret,
      { expiresIn: config.auth.jwt_expiresin }
    );

    let updatedPhotoUrl = photoUrlConverter(user.photoUrl);

    let result = {
      userId: user._id,
      photoUrl: updatedPhotoUrl,
      name: user.name,
      role: user.role,
      phone: user.phone,
      email: user.email,
      prefferredCurrency: user.preferredCurrency,
      timeZone: user.timeZone,
      token: `Bearer ${token}`,
    };

    return res.status(200).json({
      userData :result,
      message: "Congrats! You are successfully Logged in.",
      success: true,
    });
  }
}

// const validateName = async (name) => {
//   let user = await User.findOne({ name });
//   if (user) {
//     return false;
//   } else {
//     return true;
//   }
// };

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) {
    return false;
  } else {
    return true;
  }
};
