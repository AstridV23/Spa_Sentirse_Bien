import Booking from '../models/booking_model.js'

// Método para guardar un turno en BD
export const createBooking = async (req, res) =>{
    try {
        const { service, treatment, date, info } = req.body;

        if (!service || ! treatment || !date) {
            return res.status(400).json({message: "Faltan campos requeridos para completar la solicitud."})
        };

        const newBooking = new Booking({
            service,
            treatment,
            date,
            info,
            //user: req.user.id
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);

    } catch (error) {
        res.status(500).json({ message: 'Error al reservar turno.', error });
    }
}

// Método para eliminar un turno
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }

        res.status(204).send(); // Enviar una respuesta vacía
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la reserva.', error });
    }
};

// Método para obtener todas las reservas
export const getAllBookings = async (req, res) => {
    try {
        // Consultar todas las reservas en la base de datos
        const bookings = await Booking.find().populate('user'); 

        // Enviar las reservas en la respuesta
        res.status(200).json(bookings);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: 'Error al obtener todas las reservas.', error });
    }
};

//Retorna las reservas de un cliente
export const getPersonalBookings = async(req, res) => {
    try {
        const booking = await Booking.find({
            user: req.user.id
        }).populate('user')
        res.json(booking)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reservas.', error });
    }
}

//Retorna las reservas activas
export const getActiveBookings = async(req, res) => {
    try {
        const booking = await Booking.find({
            satus: "reservado" || "pagado",
        }).populate('user')
        res.json(booking)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener reservas.', error });
    }
}

export const getBookingsByDate = async(req, res) => {
    try {
        // Obtener los parámetros de fecha desde la consulta de la solicitud (query params)
        const { startDate, endDate } = req.query;

        // Construir un filtro basado en las fechas, si son proporcionadas
        const dateFilter = {};
        
        if (startDate) {
            dateFilter.createdAt = { $gte: new Date(startDate) }; // Mayor o igual a la fecha de inicio
        }
        
        if (endDate) {
            dateFilter.createdAt = dateFilter.createdAt || {};
            dateFilter.createdAt.$lte = new Date(endDate); // Menor o igual a la fecha de fin
        }

        // Ejecutar la consulta con el filtro de fechas si existe
        const booking = await Booking.find(dateFilter);
        
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener reservas." });
    }
}

//Cambiar estado de la reserva
export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { service, treatment, date, info } = req.body;
        const user = req.user ? req.user.username : 'Unknown';
            
        if (!service || !treatment || !date || !user) {
            return res.status(400).json({ message: 'Faltan campos requeridos para procesar la solicitud.' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { service, treatment, date, info, satus: false, user },
            { new: true, runValidators: true } // new: true devuelve el documento actualizado, runValidators asegura que los datos cumplen con el esquema            
        );

        if (!updatedBooking) {
            return res.status(404).json({message: "Reserva no encontrada"})
        }

        res.satus(200).json(updatedBooking)
    } catch (error) {
        res.status(500).json({message: "Reserva no encontrada"})
    }
}