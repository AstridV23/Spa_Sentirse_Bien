import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPDF = (req, res) => {
    console.log('Iniciando generación de PDF');
    const { tipo } = req.params;
    
    try {
        // Crea un nuevo documento PDF
        const doc = new PDFDocument({
            margins: { top: 50, bottom: 50, left: 72, right: 72 }
        });

        // Configurar la respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${tipo}.pdf"`);

        // Manejar errores en la tubería
        doc.on('error', (err) => {
            console.error('Error en la generación del PDF:', err);
            res.status(500).end();
        });

        // Pipe the PDF to the response
        doc.pipe(res);

        // Añadir logo
        const logoPath = path.join(__dirname, '../../public/logo.png');
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 45, { width: 50 });
        }

        // Título del informe
        doc.font('Helvetica-Bold').fontSize(18)
           .text(`Informe de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, 120, 60);

        // Fecha del informe
        doc.font('Helvetica').fontSize(10)
           .text(`Fecha: ${new Date().toLocaleDateString()}`, 120, 80);

        // Línea separadora
        doc.moveTo(50, 100).lineTo(550, 100).stroke();

        // Contenido del informe
        doc.moveDown();
        doc.font('Helvetica').fontSize(12);

        let contenido;
        switch(tipo) {
            case 'usuarios':
                contenido = 'Este informe presenta un resumen detallado de los usuarios registrados en el sistema...';
                break;
            case 'turnos':
                contenido = 'A continuación se muestra un resumen de los turnos programados...';
                break;
            case 'pagos':
                contenido = 'Este documento proporciona un análisis de los pagos recibidos...';
                break;
            default:
                contenido = `Informe general para: ${tipo}`;
        }

        doc.text(contenido, {
            width: 500,
            align: 'justify'
        });

        // Pie de página
        const bottomOfPage = doc.page.height - 50;
        doc.fontSize(10).text('Página 1 de 1', 50, bottomOfPage, {
            align: 'center'
        });

        // Finalizar el PDF
        doc.end();

        console.log(`PDF con tipo "${tipo}" generado correctamente`);
    } catch (error) {
        console.error('Error detallado al generar el PDF:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
        }
    }
};

const getPaymentsByDateAndType = async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;
        
        let query = {};
        
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        
        if (type) {
            query.type = type;
        }
        
        const payments = await Payment.find(query);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
