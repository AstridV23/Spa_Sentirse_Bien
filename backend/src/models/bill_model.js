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
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientCUIT: {
    type: String,
    match: /^[0-9]{11}$/,
    trim: true
  },
  services: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
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