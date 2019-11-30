import mongoose from "mongoose";

const accountDriverSchema = new mongoose.Schema({
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  numberReceipts: { type: Number, default: 0 },
  totalReceipts: { type: Number, default: 0 },
  externalRequests: { type: Number, default: 0 },
  totalPayment: { type: Number, default: 0 },
  date: { type: String, required: true }
});
const updateOrInsert = { upsert: true, new: true, setDefaultsOnInsert: true };

accountDriverSchema.static.addTravel = async travel => {};
accountDriverSchema.static.removeTravel = async travel => {};

accountDriverSchema.static.addPayment = async payment => {};
accountDriverSchema.static.removePayment = async payment => {};

accountDriverSchema.static.addExpenses = async expenses => {};
accountDriverSchema.static.removeExpenses = async expenses => {};

export default mongoose.model("accountDriver", accountDriverSchema);
