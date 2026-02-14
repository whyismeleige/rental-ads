const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const getRandomAvatar = () => {
  const seed = crypto.randomUUID();
  const styles = [
    "adventurer", "big-smile", "fun-emoji", "lorelei", 
    "micah", "notionists", "pixel-art", "croodles",
  ];
  const style = styles[Math.floor(Math.random() * styles.length)];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      index: true,
    },
    avatar: {
      type: String,
      default: getRandomAvatar, 
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.methods.passwordsMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

module.exports = mongoose.model("User", UserSchema);