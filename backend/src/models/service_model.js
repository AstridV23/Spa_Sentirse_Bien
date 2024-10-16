import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: true
    },
    service_type: {
        type: String,
        required: true
    },
    service_description: {
        type: String,
        required: true
    },
    service_price: {
        type: Number,
        required: true
    },
    encargado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model('Service', serviceSchema);