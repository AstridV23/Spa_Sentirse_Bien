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
    hours: [{
        type: String,
        validate: {
          validator: function(v) {
            return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
          },
          message: props => `${props.value} no es un formato de hora válido. Use HH:MM.`
        },
        required: [true, 'Al menos una hora es requerida']
    }],
    encargado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model('Service', serviceSchema);