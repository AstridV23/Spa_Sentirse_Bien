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

            // Configuración de la tabla
            const tableTop = 150; // Reducir este valor para subir la tabla
            const tableLeft = 50;
            const rowHeight = 20;
            const colWidths = [80, 60, 80, 80, 60, 100];
            const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
            const tableHeight = (bookings.length + 1) * rowHeight;
            const tableBottom = tableTop + tableHeight;

            // Resumen de turnos
            doc.font('Helvetica-Bold').fontSize(14)
               .text(`Resumen de turnos: ${total}`, 50, tableTop - 30, { align: 'left' });

            // Función para dibujar una línea
            const drawLine = (x1, y1, x2, y2) => {
                doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
            };

            // Dibujar el contorno de la tabla
            drawLine(tableLeft, tableTop, tableLeft + tableWidth, tableTop);
            drawLine(tableLeft, tableTop, tableLeft, tableBottom);
            drawLine(tableLeft + tableWidth, tableTop, tableLeft + tableWidth, tableBottom);
            drawLine(tableLeft, tableBottom, tableLeft + tableWidth, tableBottom);

            // Encabezados de la tabla
            doc.font('Helvetica-Bold').fontSize(10);
            let currentLeft = tableLeft;
            ['Fecha', 'Hora', 'Servicio', 'Tratamiento', 'Costo', 'Cliente'].forEach((header, i) => {
                doc.text(header, currentLeft + 5, tableTop + 5, { width: colWidths[i], align: 'left' });
                currentLeft += colWidths[i];
                if (i < colWidths.length - 1) {
                    drawLine(currentLeft, tableTop, currentLeft, tableBottom);
                }
            });

            // Línea horizontal después de los encabezados
            drawLine(tableLeft, tableTop + rowHeight, tableLeft + tableWidth, tableTop + rowHeight);

            // Filas de la tabla
            doc.font('Helvetica').fontSize(8);
            bookings.forEach((booking, index) => {
                const y = tableTop + rowHeight * (index + 1);
                currentLeft = tableLeft;

                [
                    new Date(booking.date).toLocaleDateString(),
                    booking.hour || '',
                    booking.service || '',
                    booking.treatment || '',
                    `$${booking.cost || 0}`,
                    booking.user ? `${booking.user.firstname || ''} ${booking.user.lastname || ''}` : 'Usuario no disponible'
                ].forEach((text, i) => {
                    doc.text(text, currentLeft + 5, y + 5, { width: colWidths[i], align: 'left' });
                    currentLeft += colWidths[i];
                });

                // Línea horizontal después de cada fila
                drawLine(tableLeft, y + rowHeight, tableLeft + tableWidth, y + rowHeight);
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
