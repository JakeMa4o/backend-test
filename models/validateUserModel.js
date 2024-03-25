import mongoose from "mongoose"

const validateUserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    login: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    cpassword: {
      type: String,
      required: true
    },
    validationCode: {
      type: String,
      required: true
    }
  },
  {
    timestaps: true
  }
)

export const ValidateUser = mongoose.model("ValidateUser", validateUserSchema);