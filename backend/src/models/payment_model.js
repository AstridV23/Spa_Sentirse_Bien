import mongoose from "mongoose";
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  cardType: {
    type: String,
    enum: ["crédito", "débito"],
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    match: /^[0-9]{16}$/,
    get: (number) => `****-****-****-${number.slice(-4)}`,
    set: (number) => number.replace(/\s/g, '')
  },
  cardName: {
    type: String,
    required: true,
    trim: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  cvv: {
    type: String,
    required: true,
    match: /^[0-9]{3,4}$/,
    select: false // No se incluirá en las consultas por defecto
  },
  cuit: {
    type: String,
    required: true,
    match: /^[0-9]{11}$/
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    default: 'aprobado'
  }
}, {
  timestamps: true
});

// Índice para mejorar las búsquedas por usuario
paymentSchema.index({ user: 1 });

export default model("Payment", paymentSchema);
 