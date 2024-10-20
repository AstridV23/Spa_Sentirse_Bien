import Payment from "../models/payment_model.js";

export const createPayment = async (req, res) => {
    try {
        const { cardType, cardNumber, cardName, expirationDate, cvv, cuit, amount } = req.body;

        // Verificar que todos los campos requeridos estén presentes
        if (!cardType || !cardNumber || !cardName || !expirationDate || !cvv || !cuit || !amount) {
            return res.status(400).json({ message: "Faltan campos requeridos para completar la solicitud." });
        }

        // Validar el tipo de tarjeta
        if (!["crédito", "débito"].includes(cardType)) {
            return res.status(400).json({ message: "Tipo de tarjeta inválido." });
        }

        // Validar el formato del número de tarjeta
        if (!/^[0-9]{16}$/.test(cardNumber)) {
            return res.status(400).json({ message: "Número de tarjeta inválido." });
        }

        // Validar el formato del CVV
        if (!/^[0-9]{3,4}$/.test(cvv)) {
            return res.status(400).json({ message: "CVV inválido." });
        }

        // Validar el formato del CUIT
        if (!/^[0-9]{11}$/.test(cuit)) {
            return res.status(400).json({ message: "CUIT inválido." });
        }

        const [month, year] = expirationDate.split('-');
        const vencimiento = new Date(parseInt(`20${year}`, 10), parseInt(month, 10) - 1);

        // Crear el nuevo pago
        const newPayment = new Payment({
            cardType,
            cardNumber,
            cardName,
            expirationDate: vencimiento,
            cvv,
            cuit,
            amount,
            //user: req.user.id,
            status: 'aprobado' // Estado inicial del pago
        });

        const savedPayment = await newPayment.save();

        // Enviar respuesta sin incluir información sensible
        res.status(201).json({
            id: savedPayment._id,
            cardType: savedPayment.cardType,
            cardName: savedPayment.cardName,
            amount: savedPayment.amount,
            status: savedPayment.status,
            createdAt: savedPayment.createdAt
        });

    } catch (error) {
        console.error('Error al realizar el pago:', error);
        res.status(500).json({ message: 'Error al realizar el pago.', error: error.message });
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

        if (result.length === 0) {
            return res.json({ payments: [], totalAmount: 0 });
        }

        const { payments, totalAmount } = result[0];

        res.json({ payments, totalAmount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener pagos." });
    }
}
