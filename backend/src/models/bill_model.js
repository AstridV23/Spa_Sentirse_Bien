import { Schema, model } from "mongoose";

const billSchema = new Schema({
  letter: {
    type: String,
    enum: ["A", "B"],
    required: true
  },
  sellingPoint: {
    type: Number,
    required: true,
    min: 1
  },
  billNumber: {
    type: Number,
    required: true,
    min: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    require: true
  },
  clientCUIT: {
    type: String,
    match: /^[0-9]{11}$/,
    trim: true
  },
  services: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    require: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

billSchema.index({ sellingPoint: 1, billNumber: 1 }, { unique: true });

export default model("Bill", billSchema);