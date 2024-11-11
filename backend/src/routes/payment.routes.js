import { Router } from 'express'
import { createPayment, getPaymentsByDateAndType } from '../controllers/payment.controller.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/validateToken.js'
import { paymentSchema } from '../schemas/payment.schema.js'

const router = new Router()

router.post("/payment", authRequired, validateSchema(paymentSchema), createPayment);
router.get("/payment", /*authRequired,*/ getPaymentsByDateAndType);

export default router