import mongoose from "mongoose";

const accountCarSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "car",
    required: true
  },
  numberTravel: { type: Number, default: 0 },

  emptyTo: { type: Number, default: 0 },

  emptyBack: { type: Number, default: 0 },
  expensesMax: { type: Number, default: 0 },
  numberReceipts: { type: Number, default: 0 },
  totalReceipts: { type: Number, default: 0 },
  totalTravel: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  totalExternalExpenses: { type: Number, default: 0 },
  date: { type: String, required: true }
});

const updateOrInsert = { upsert: true, new: true, setDefaultsOnInsert: true };

accountCarSchema.static.addTravel = async (travel, isExpoensesMax = false) => {
  try {
    const date = `${travel.date.getFullYear()}-${travel.date.getMonth() + 1}`;
    const inc = {
      $inc: {
        numberTravel: 1,
        emptyTo: travel.totalTo == 0 ? 1 : 0,
        emptyBack: travel.totalBack == 0 ? 1 : 0,
        expensesMax: isExpoensesMax ? 1 : 0,
        numberReceipts: travel.repairing.length,
        totalReceipts: travel.repairing.reduce((a, b) => a + b, 0),
        totalTravel: travel.totalTo + travel.totalBack,
        totalExpenses: travel.expenses
      }
    };
    await this.findOneAndUpdate({ date, car: travel.car }, inc, updateOrInsert);
  } catch (e) {
    console.error(e);
  }
};
accountCarSchema.static.removeTravel = async (
  travel,
  isExpoensesMax = false
) => {
  try {
    const date = `${travel.date.getFullYear()}-${travel.date.getMonth() + 1}`;
    const inc = {
      $inc: {
        numberTravel: -1,
        emptyTo: travel.totalTo == 0 ? -1 : 0,
        emptyBack: travel.totalBack == 0 ? -1 : 0,
        expensesMax: isExpoensesMax ? -1 : 0,
        numberReceipts: -1 * travel.repairing.length,
        totalReceipts: -1 * travel.repairing.reduce((a, b) => a + b, 0),
        totalTravel: -1 * (travel.totalTo + travel.totalBack),
        totalExpenses: -1 * travel.expenses
      }
    };
    await this.findOneAndUpdate({ date, car: travel.car }, inc, updateOrInsert);
  } catch (e) {
    console.error(e);
  }
};

accountCarSchema.static.addExpenses = async expenses => {
  try {
    if (!expenses._onCar) return;
    const date = `${expenses.date.getFullYear()}-${expenses.date.getMonth() +
      1}`;
    const inc = { $inc: { totalExternalExpenses: expenses.amount } };
    await this.findOneAndUpdate(
      { date, car: expenses.car },
      inc,
      updateOrInsert
    );
  } catch (e) {
    console.error(e);
  }
};
accountCarSchema.static.removeExpenses = async expenses => {
  try {
    if (!expenses._onPartner) return;
    const date = `${expenses.date.getFullYear()}-${expenses.date.getMonth() +
      1}`;
    const inc = { $inc: { totalExternalExpenses: -1 * expenses.amount } };
    await this.findOneAndUpdate(
      { date, car: expenses.car },
      inc,
      updateOrInsert
    );
  } catch (e) {
    console.error(e);
  }
};

export default mongoose.model("accountCar", accountCarSchema);
