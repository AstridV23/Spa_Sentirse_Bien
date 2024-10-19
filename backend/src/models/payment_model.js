import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  cardType: {
    type: String,
    enum: ["crédito", "débito"],
    required: true
  },
  cardNumber: {
    type: String,
    trim: true,
    required: true,
    match: /^[0-9]{16}$/,
  },
  cardName: {
    type: String,
    required: true,
    trim: true
  },
  expirationDate: {
    type: String, 
    required: true,
    match: /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/, 
  },
  cvv: {
    type: String,
    required: true,
    match: /^[0-9]{3,4}$/
  },
  cuit: {
    type: String,
    required: true,
    match: /^[0-9]{11}$/
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
},
}, {
  timestamps: true
});

export default model("Payment", paymentSchema);
