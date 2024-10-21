import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllBookings } from './booking.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPDF = async (req, res) => {
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

        if (tipo === 'turnos') {
            // Crear un objeto de respuesta simulado para pasar a getAllBookings
            let bookingsData;
            const mockRes = {
                status: () => mockRes,
                json: (data) => {
                    bookingsData = data;
                    return mockRes;
                }
            };

            // Obtener los datos de turnos usando el controlador importado
            await getAllBookings(req, mockRes);

            // Verificar si bookingsData es undefined o null
            if (!bookingsData) {
                throw new Error('No se pudieron obtener los datos de las reservas');
            }

            const { bookings, total } = bookingsData;

            // Crear la tabla
            doc.font('Helvetica-Bold').fontSize(14).text(`Total de turnos: ${total}`, { align: 'center' });
            doc.moveDown();

            const tableTop = 200;
            const tableLeft = 50;
            const rowHeight = 20;
            const colWidths = [80, 80, 80, 60, 60, 100];

            // Encabezados de la tabla
            doc.font('Helvetica-Bold').fontSize(10);
            ['Fecha', 'Hora', 'Servicio', 'Tratamiento', 'Costo', 'Cliente'].forEach((header, i) => {
                doc.text(header, tableLeft + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop);
            });

            // Filas de la tabla
            doc.font('Helvetica').fontSize(8);
            bookings.forEach((booking, index) => {
                const y = tableTop + rowHeight * (index + 1);
                doc.text(new Date(booking.date).toLocaleDateString(), tableLeft, y);
                doc.text(booking.hour || '', tableLeft + colWidths[0], y);
                doc.text(booking.service || '', tableLeft + colWidths[0] + colWidths[1], y);
                doc.text(booking.treatment || '', tableLeft + colWidths[0] + colWidths[1] + colWidths[2], y);
                doc.text(`$${booking.cost || 0}`, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y);
                
                // Manejar el caso en que booking.user pueda ser null
                const userName = booking.user 
                    ? `${booking.user.firstname || ''} ${booking.user.lastname || ''}`
                    : 'Usuario no disponible';
                doc.text(userName, tableLeft + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y);
            });

        } else {
            // Contenido para otros tipos de informes
            let contenido;
            switch(tipo) {
                case 'usuarios':
                    contenido = 'Este informe presenta un resumen detallado de los usuarios registrados en el sistema...';
                    break;
                case 'pagos':
                    contenido = 'Este documento proporciona un análisis de los pagos recibidos...';
                    break;
                default:
                    contenido = `Informe general para: ${tipo}`;
            }
            doc.text(contenido, { width: 500, align: 'justify' });
        }

        // Pie de página
        const bottomOfPage = doc.page.height - 50;
        doc.fontSize(10).text('Página 1 de 1', 50, bottomOfPage, { align: 'center' });

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
