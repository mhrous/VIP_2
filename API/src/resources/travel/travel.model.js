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
  totalTo: { type: Number, default: 0 },
  totalBack: { type: Number, default: 0 },
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
        _type: { type: String, enum: ["g", "b"] },
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
