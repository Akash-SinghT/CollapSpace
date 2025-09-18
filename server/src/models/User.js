import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import passport from "passport";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.oauthProvider; // password not required for oAuth users
      },
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: null,
    },
    oauthProvider: {
      type: String,
      enum: ["google", "github"],
      required: false,
    },
  },
  { timestamps: true }
);

// hash password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model("User", userSchema);
