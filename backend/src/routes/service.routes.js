import { Router } from 'express'
import { createService, getServices} from '../controllers/service.controller.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/validateToken.js'
import {createServiceSchema} from '../schemas/service.schema.js'

const router = new Router()

router.post("/service", validateSchema(createServiceSchema), createService);

router.get("/service", getServices)


export default router