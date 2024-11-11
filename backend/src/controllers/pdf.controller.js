import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllBookings } from './booking.controller.js';
import { getPaymentsByDateAndType } from './payment.controller.js';
import { getUsers } from './auth.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPDF = async (req, res) => {
    console.log('Iniciando generación de PDF');
    const { tipo } = req.params;
    
    let doc;
    try {
        doc = new PDFDocument({
            margins: { top: 50, bottom: 50, left: 72, right: 72 }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${tipo}.pdf"`);

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
        } else if (tipo === 'pagos') {
            try {
                // Obtener datos de pagos
                const mockReq = { query: {} }; // Ajusta según sea necesario
                const { payments, totalAmount } = await getPaymentsByDateAndType(mockReq);

                if (!payments || !Array.isArray(payments)) {
                    throw new Error('No se pudieron obtener los datos de pagos correctamente');
                }

                // Configuración de la tabla
                const tableTop = 150;
                const tableLeft = 50;
                const rowHeight = 20;
                const colWidths = [80, 60, 80, 80, 60, 100];
                const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
                const tableHeight = (payments.length + 1) * rowHeight;
                const tableBottom = tableTop + tableHeight;

                // Resumen de pagos con el total en verde
                doc.font('Helvetica-Bold').fontSize(14)
                   .text('Resumen de pagos: Total ', 50, tableTop - 30, { continued: true })
                   .fillColor('green')
                   .text(`$${totalAmount || 0}`, { align: 'left' })
                   .fillColor('black'); // Volver al color negro para el resto del texto

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
                ['Fecha', 'Tipo', 'Número', 'Nombre', 'Monto', 'Estado'].forEach((header, i) => {
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
                payments.forEach((payment, index) => {
                    const y = tableTop + rowHeight * (index + 1);
                    currentLeft = tableLeft;

                    [
                        new Date(payment.createdAt).toLocaleDateString(),
                        payment.cardType,
                        payment.cardNumber.slice(-4),
                        payment.cardName,
                        `$${payment.amount}`,
                        payment.status
                    ].forEach((text, i) => {
                        doc.text(text, currentLeft + 5, y + 5, { width: colWidths[i], align: 'left' });
                        currentLeft += colWidths[i];
                    });

                    // Línea horizontal después de cada fila
                    if (index < payments.length - 1) {
                        drawLine(tableLeft, y + rowHeight, tableLeft + tableWidth, y + rowHeight);
                    }
                });
            } catch (error) {
                console.error('Error al obtener datos de pagos:', error);
                doc.text('Error al generar el informe de pagos', 50, 150);
            }
        } else if (tipo === 'usuarios') {
            try {
                // Obtener datos de usuarios
                const { users, status, message, error } = await getUsers(req, (response) => response);

                if (status !== 200 || !users || !Array.isArray(users)) {
                    throw new Error(message || 'No se pudieron obtener los datos de usuarios correctamente');
                }

                // Configuración de la tabla
                const tableTop = 150;
                const tableLeft = 50;
                const headerHeight = 40;
                const rowHeight = 20;
                // Ajustamos los anchos de las columnas, dando más espacio a "Fecha Creación"
                const colWidths = [65, 65, 130, 65, 55, 90];
                const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
                const tableHeight = headerHeight + (users.length * rowHeight);
                const tableBottom = tableTop + tableHeight;

                // Resumen de usuarios
                doc.font('Helvetica-Bold').fontSize(14)
                   .text(`Total de usuarios: ${users.length}`, 50, tableTop - 30, { align: 'left' });

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
                ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Rol', 'Fecha Creación'].forEach((header, i) => {
                    doc.text(header, currentLeft + 5, tableTop + 15, {
                        width: colWidths[i],
                        align: 'left',
                        lineBreak: false
                    });
                    currentLeft += colWidths[i];
                    if (i < colWidths.length - 1) {
                        drawLine(currentLeft, tableTop, currentLeft, tableBottom);
                    }
                });

                // Línea horizontal después de los encabezados
                drawLine(tableLeft, tableTop + headerHeight, tableLeft + tableWidth, tableTop + headerHeight);

                // Filas de la tabla
                doc.font('Helvetica').fontSize(7); // Mantenemos el tamaño de fuente reducido
                users.forEach((user, index) => {
                    const y = tableTop + headerHeight + (rowHeight * index);
                    currentLeft = tableLeft;

                    [
                        user.firstname,
                        user.lastname,
                        user.email,
                        user.phone,
                        user.role,
                        new Date(user.createdAt).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                        })
                    ].forEach((text, i) => {
                        doc.text(text || '', currentLeft + 5, y + 5, { 
                            width: colWidths[i] - 10, 
                            align: 'left',
                            lineBreak: false,
                            ellipsis: true
                        });
                        currentLeft += colWidths[i];
                    });

                    // Línea horizontal después de cada fila
                    if (index < users.length - 1) {
                        drawLine(tableLeft, y + rowHeight, tableLeft + tableWidth, y + rowHeight);
                    }
                });
            } catch (error) {
                console.error('Error al obtener datos de usuarios:', error);
                doc.text('Error al generar el informe de usuarios', 50, 150);
            }
        } else {
            // Contenido para otros tipos de informes
            doc.text(`Informe general para: ${tipo}`, { width: 500, align: 'justify' });
        }

        // Pie de página
        const bottomOfPage = doc.page.height - 50;
        doc.fontSize(10).text('Página 1 de 1', 50, bottomOfPage, { align: 'center' });

        doc.end();
        console.log(`PDF con tipo "${tipo}" generado correctamente`);
    } catch (error) {
        console.error('Error detallado al generar el PDF:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
        }
        if (doc && typeof doc.end === 'function') {
            doc.end();
        }
    }
};
