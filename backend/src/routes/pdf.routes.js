/*Ruta de prueba para devolver el PDF*/

import { Router } from 'express'
import serviceSummaryPDF from '../libs/pdf_services.js'; 


const router = Router();

// ruta para imprimir todos los servicios 
router.get('/services-sumary', async (req, res) => {

    try {
        await serviceSummaryPDF(req, res);
    } catch (error) {
        console.error('Error generating services summary:', error);
        res.status(500).send('Error generating PDF');
    }

});

// Ruta para generar la factura en PDF
router.post('/generar-factura', (req, res) => {
    generatePDFPayment(req, res);
});

export default router