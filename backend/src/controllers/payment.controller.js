import Payment from "../models/payment_model.js";
import Booking from "../models/booking_model.js";
import { paymentSchema } from "../schemas/payment.schema.js";

export const createPayment = async (req, res) => {
    try {

        const validatedData = paymentSchema.parse(req.body);

        // Buscar la reserva y obtener el costo
        const booking = await Booking.findById(validatedData.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Reserva no encontrada.", bookingId: validatedData.bookingId });
        }

        const amount = booking.cost;

        const [mes, ano] = validatedData.expirationDate.split('-');
        const vencimiento = new Date(parseInt('20' + ano), parseInt(mes) - 1);
        if (vencimiento < new Date()) {
            return res.status(400).json({ message: "La tarjeta ha expirado.", expirationDate: validatedData.expirationDate });
        }

        // Crear el nuevo pago
        const newPayment = new Payment({
            cardType: validatedData.cardType,
            cardNumber: validatedData.cardNumber,
            cardName: validatedData.cardName,
            expirationDate: vencimiento,
            cvv: validatedData.cvv,
            cuit: validatedData.cuit,
            amount,
            user: req.user.id,
            booking: validatedData.bookingId,
            status: 'aprobado'
        });

        const savedPayment = await newPayment.save();

        // Actualizar el estado de la reserva
        await Booking.findByIdAndUpdate(validatedData.bookingId, { status: 'pagado' });

        // Enviar respuesta sin incluir información sensible
        res.status(201).json({
            success: true,
            message: "Pago procesado correctamente",
            id: savedPayment._id,
            amount: savedPayment.amount,
            status: savedPayment.status,
        });

    } catch (error) {
        console.error('Error al realizar el pago:', error);
        res.status(500).json({ success: false, message: 'Error al realizar el pago.', error: error.message });
    }
};

export const getPaymentsByDateAndType = async (req, res) => {
    try {
        const { startDate, endDate, cardType } = req.query;

        const filter = {};
        
        if (startDate) {
            filter.createdAt = { $gte: new Date(startDate) };
        }
        
        if (endDate) {
            filter.createdAt = filter.createdAt || {};
            filter.createdAt.$lte = new Date(endDate);
        }

        if (cardType && ['crédito', 'débito'].includes(cardType)) {
            filter.cardType = cardType;
        }

        const result = await Payment.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    payments: { $push: '$$ROOT' },
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        const response = result.length > 0 
            ? { payments: result[0].payments, totalAmount: result[0].totalAmount }
            : { payments: [], totalAmount: 0 };

        return response; // Cambiado de res.json a return
    } catch (error) {
        console.error(error);
        throw error; // Lanzar el error en lugar de enviar una respuesta
    }
}
