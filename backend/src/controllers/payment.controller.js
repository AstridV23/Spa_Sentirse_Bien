import Payment from "../models/payment_model.js";

export const createPayment = async (req, res) =>{
    try {
        const { cardtype, cardNumber, cardName, expirationDate, cvv } = req.body;

        if (!cardtype || ! cardNumber || !cardName || !expirationDate || !cvv) {
            return res.status(400).json({message: "Faltan campos requeridos para completar la solicitud."})
        };

        const newPayment = new Payment({
            cardType,
            cardNumber,
            cardName,
            expirationDate,
            cvv,
            user: req.user.id
        });

        const savedPayment = await newPayment.save();
        res.satus(201).json(savedPayment);

    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el pago.', error });
    }
}