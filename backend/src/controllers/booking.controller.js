import Booking from '../models/booking_model.js'
import User from '../models/user_model.js';

// Método para guardar un turno en BD
export const createBooking = async (req, res) =>{
    try {
        const { service, treatment, date, hour, info, cost, status } = req.body;

        if (!service || ! treatment || !date || !hour || !cost) {
            return res.status(400).json({message: "Faltan campos requeridos para completar la solicitud."})
        };

        const bookingDate = new Date(date);
        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({message: "La fecha proporcionada no es válida."});
        }

        const newBooking = new Booking({
            service,
            treatment,
            date: bookingDate,
            hour,
            info,
            cost,
            user: req.user.id,
            status: status || "reservado",
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);

    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ message: 'Error al reservar turno.', error: error.message });
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
        const { username } = req.query; // Obtener el nombre de usuario de los parámetros de consulta
        let query = {};

        if (username) {
            // Si se proporciona un nombre de usuario, buscamos primero el usuario
            const user = await User.findOne({ username: new RegExp(username, 'i') });
            if (user) {
                query.user = user._id;
            } else {
                // Si no se encuentra el usuario, devolvemos un array vacío
                return res.status(200).json({ bookings: [], total: 0 });
            }
        }

        // Consultar las reservas en la base de datos con el filtro (si existe)
        const bookings = await Booking.find(query).populate('user');

        // Contar el total de reservas que coinciden con la consulta
        const total = await Booking.countDocuments(query);

        // Enviar las reservas y el total en la respuesta
        res.status(200).json({
            bookings: bookings,
            total: total
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ message: 'Error al obtener las reservas.', error: error.message });
    }
};

//Retorna las reservas de un cliente
export const getPersonalBookings = async(req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('user');
        res.json(bookings);
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