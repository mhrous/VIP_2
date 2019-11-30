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
  _onCar: { type: Boolean, default: false },
  _onDriver: { type: Boolean, default: false },
  _onPartner: { type: Boolean, default: true },
  partner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  amount: { type: Number, required: true },
  _for: { type: String, deflate: "" },
  date: { type: Date, required: true }
});

exponsesSchema.index({ date: 1 });

export default mongoose.model("exponses", exponsesSchema);
