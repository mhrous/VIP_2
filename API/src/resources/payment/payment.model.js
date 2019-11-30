import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  _type: { type: String, enum: ["D", "P"], default: "D" }
});

paymentSchema.index({ date: 1 });

export default mongoose.model("payment", paymentSchema);
