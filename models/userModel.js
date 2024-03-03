import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    login: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    cpassword: {
      type: String,
      required: true
    }
  },
  {
    timestaps: true
  }
)

export const User = mongoose.model("User", userSchema);