import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    service: {
        type: String,
        trim: true,
        require: true
    },
    treatment: {
        type: String,
        required: true,
        trim: true
    },
    date:{
        type: Date,
        required: true,
    },
    hour: {
        type: String,
        required: true
    },
    info: {
        type: String,
    },
    cost: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    status: {
        type: String,
        enum: ["reservado", "pagado", "cancelado", "finalizado"],
        default: "reservado"
    }
},    {
    timestamps: true
})

export default mongoose.model('Booking', bookingSchema)