import { Router } from 'express'
import { createPayment } from '../controllers/payment.controller.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/validateToken.js'
import { paymentSchema } from '../schemas/payment.schema.js'

const router = new Router()

router.post("/payment", validateSchema(paymentSchema), createPayment);

export default router