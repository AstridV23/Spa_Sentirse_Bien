import { Router } from "express";
import { createPDF } from "../controllers/pdf.controller.js";

const router = Router();

router.get("/pdf/:tipo", createPDF);

export default router;
