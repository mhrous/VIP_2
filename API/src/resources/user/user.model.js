import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: { type: String, required: true },
  phone: {
    type: [
      {
        phoneType: String,
        value: String,
        _id: { type: Date, default: new Date() }
      }
    ]
  },
  address: { type: String },
  active: { type: Boolean, default: true },
  power: {
    type: String,
    enum: ["admin", "s_admin", "S", "D", "P"]
  }
});

export default mongoose.model("user", userSchema);
