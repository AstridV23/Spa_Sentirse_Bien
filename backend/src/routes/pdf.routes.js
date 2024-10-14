/*Ruta de prueba para devolver el PDF*/

import { Router } from 'express'
import serviceSummaryPDF from '../libs/pdf_services.js'; 


const router = Router();

router.get('/pdf', async (req, res) => {

    try {
        await serviceSummaryPDF(req, res);
    } catch (error) {
        console.error('Error generating booking summary:', error);
        res.status(500).send('Error generating PDF');
    }

});

export default router