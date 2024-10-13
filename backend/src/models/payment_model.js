import { Schema, model } from "mongoose";

const paymentSchema = new Schema ({
    cardType: {
        type: String,
        enum: ["crédito", "débito"],
        required: true
    },
    cardNumber: {
        type: String,
        trim: true,
        required: true
    },
    cardName: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    cvv: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default model("Payment", paymentSchema)