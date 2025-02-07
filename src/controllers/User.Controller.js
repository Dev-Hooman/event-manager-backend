import User from "../models/User.js";
import validateUser from "../validations/userValidation.js";

export async function getAllUsers(req, res) {
  try {
    const users = await User.aggregate([
      {
        $match: {
          role: { $ne: "superadmin" },
        },
      },
    ]);

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error fetching users: ", error);
    return res
      .status(500)
      .json({ error: "Error fetching users", success: false });
  }
}

export async function removeUser(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    return res.status(200).json({ success: true, message: "User removed" });
  } catch (error) {
    console.log("Error removing user: ", error);
    return res
      .status(500)
      .json({ error: "Error removing user", success: false });
  }
}

export async function updateUser(req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details[0].message, success: false });
  }

  const { email } = req.user;
  const { name, phone, photoUrl, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    const newHashedPassword = await bcrypt.hash(password, 10);
    user.password = newHashedPassword;
    user.name = name;
    user.phone = phone;
    user.photoUrl = photoUrl;

    await user.save();

    return res.json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error during profile update:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
}
