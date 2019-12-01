import mongoose from "mongoose";

const travelSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "car",
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driver",
    required: true
  },
  date: { type: Date, required: true },
  cashTo: { type: Number, default: 0 },
  cashBack: { type: Number, default: 0 },
  expenses: { type: Number, default: 0 },
  repairing: {
    type: [
      {
        _id: { type: Date, default: new Date() },
        clientName: { type: String },
        clientPhone: { type: String },
        value: { type: Number, default: 0 },
        partner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true
        },
        isGO: { type: Boolean},
        from: { type: String }
      }
    ]
  },
  const: { type: Boolean, default: false },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

travelSchema.index({ date: 1 });

export default mongoose.model("travel", travelSchema);
