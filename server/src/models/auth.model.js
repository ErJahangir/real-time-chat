import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 8,
    },
    profile: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", authSchema);

export default User;
