import { Router } from "express";
import {
  createService,
  getServices,
  updateServiceHours,
  updateService,
} from "../controllers/service.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { authRequired } from "../middlewares/validateToken.js";
import { createServiceSchema } from "../schemas/service.schema.js";

const router = new Router();

router.post(
  "/service",
  authRequired,
  validateSchema(createServiceSchema),
  createService
);
router.put("/service/:serviceId/hours", updateServiceHours);
router.put(
  "/service/:id",
  authRequired,
  validateSchema(createServiceSchema),
  updateService
);
router.get("/service", getServices);

export default router;
