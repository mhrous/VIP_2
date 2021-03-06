import mongoose from "mongoose";

const exponsesSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "car",
    required: true
  },
  onCar: { type: Boolean, default: false },
  onDriver: { type: Boolean, default: false },
  onPartner: { type: Boolean, default: false },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  amount: { type: Number, required: true },
  reason: { type: String, deflate: "" },
  date: { type: Date, required: true }
});

exponsesSchema.index({ date: 1 });

export default mongoose.model("exponses", exponsesSchema);
