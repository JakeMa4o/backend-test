import mongoose from "mongoose"

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestaps: true
  }
)

export const Item = mongoose.model("Item", itemSchema);