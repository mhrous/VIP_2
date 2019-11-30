import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true
  },
  name: { type: String, required: true },
  expensesMax: { type: Number, require: true },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  partners: {
    type: [
      {
        _id: { type: Date, default: new Date() },
        partner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true
        },
        value: {
          type: Number,
          max: 24,
          min: 0,
          require: true
        }
      }
    ]
  },

});

export default mongoose.model("car", carSchema);
