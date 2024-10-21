import { Router } from 'express'
import { createBooking, deleteBooking, getAllBookings, getPersonalBookings, getActiveBookings, getBookingsByDate } from '../controllers/booking.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createBookingSchema } from '../schemas/booking.schema.js'

const router = Router()

router.post('/bookings', authRequired, validateSchema(createBookingSchema), createBooking);

router.delete('/bookings/:id', authRequired, deleteBooking);

router.get('/bookings', getAllBookings)
router.get('/bookings/personal', authRequired, getPersonalBookings);
router.get('/bookings', authRequired, getActiveBookings);
router.get('/bookings', authRequired, getBookingsByDate);


export default router
