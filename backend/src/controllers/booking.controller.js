import Booking from '../models/booking_model.js'

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
        const bookings = await Booking.find().populate('user', 'firstname lastname');
        
        const result = {
            bookings,
            total: bookings.length
        };

        if (res && typeof res.json === 'function') {
            // Si se llama desde una ruta API
            res.json(result);
        } else {
            // Si se llama para generar PDF
            return result;
        }
        
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        if (res && typeof res.status === 'function') {
            // Si se llama desde una ruta API
            res.status(500).json({ message: "Error al obtener las reservas." });
        } else {
            // Si se llama para generar PDF
            throw error;
        }
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

export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = req.user ? req.user.id : null; // Asumiendo que tienes el ID del usuario en req.user
            
        if (!status || !["reservado", "pagado", "cancelado", "finalizado"].includes(status)) {
            return res.status(400).json({ message: 'Estado de reserva inválido o no proporcionado.' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { 
                status,
                user // Actualizamos el usuario que hizo el cambio
            },
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error('Error al cambiar el estado de la reserva:', error);
        res.status(500).json({ message: "Error al cambiar el estado de la reserva" });
    }
};
