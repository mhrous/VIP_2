import mongoose from "mongoose";

const accountPartneSchema = new mongoose.Schema({
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

accountPartneSchema.static.addTravel = async travel => {
  try {
    const date = `${travel.date.getFullYear()}-${travel.date.getMonth() + 1}`;
    for (let r of travel.repairing) {
      const inc = { $inc: { numberReceipts: 1, totalReceipts: r.value } };
      await this.findOneAndUpdate(
        { date, partner: r.partner },
        inc,
        updateOrInsert
      );
    }
  } catch (e) {
    console.error(e);
  }


};
accountPartneSchema.static.removeTravel = async travel => {
  try {
    const date = `${travel.date.getFullYear()}-${travel.date.getMonth() + 1}`;
    for (let r of travel.repairing) {
      const inc = { $inc: { numberReceipts: -1, totalReceipts: -1 * r.value } };
      await this.findOneAndUpdate(
        { date, partner: r.partner },
        inc,
        updateOrInsert
      );
    }
  } catch (e) {
    console.error(e);
  }
};

accountPartneSchema.static.addPayment = async payment => {
  try {
    const date = `${payment.date.getFullYear()}-${payment.date.getMonth() + 1}`;
    const inc = { $inc: { totalPayment: payment.amount } };
    await this.findOneAndUpdate(
      { date, partner: payment.user },
      inc,
      updateOrInsert
    );
  } catch (e) {
    console.error(e);
  }
};
accountPartneSchema.static.removePayment = async payment => {
  try {
    const date = `${payment.date.getFullYear()}-${payment.date.getMonth() + 1}`;
    const inc = { $inc: { totalPayment: -1 * payment.amount } };
    await this.findOneAndUpdate(
      { date, partner: payment.user },
      inc,
      updateOrInsert
    );
  } catch (e) {
    console.error(e);
  }
};

accountPartneSchema.static.addExpenses = async expenses => {
  try {
    if (!expenses._onPartner) return;
    const date = `${expenses.date.getFullYear()}-${expenses.date.getMonth() +
      1}`;
    const inc = { $inc: { externalRequests: expenses.amount } };
    await this.findOneAndUpdate(
      { date, partner: expenses.partner },
      inc,
      updateOrInsert
    );
  } catch (e) {
    console.error(e);
  }
};
accountPartneSchema.static.removeExpenses = async expenses => {
  try {
    if (!expenses._onPartner) return;
    const date = `${expenses.date.getFullYear()}-${expenses.date.getMonth() +
      1}`;
    const inc = { $inc: { externalRequests: -1 * expenses.amount } };
    await this.findOneAndUpdate(
      { date, partner: expenses.partner },
      inc,
      updateOrInsert
    );
  } catch (e) {
    console.error(e);
  }
};

export default mongoose.model("accountPartne", accountPartneSchema);
