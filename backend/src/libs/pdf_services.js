import Service from '../models/service_model.js';  // Ajusta el path a tu modelo
import PDFDocument from 'pdfkit-table';

// Función para generar el PDF con los servicios
async function serviceSummaryPDF(req, res) {
    try {
        // Obtener los servicios de la base de datos
        const services = await Service.find().exec();

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Configurar la respuesta HTTP para enviar el PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="service_summary.pdf"');

        // Pipe para enviar el PDF directamente a la respuesta
        doc.pipe(res);

        // Título del documento
        doc.fontSize(20).text('Service Summary', { align: 'center' });

        // Crear tabla para resumir los servicios
        const tableData = {
            headers: ['Service Name', 'Service Type', 'Description', 'Price'],
            rows: services.map(service => [
                service.service_name,
                service.service_type,
                service.service_description,
                `$${service.service_price.toFixed(2)}`
            ])
        };

        // Generar la tabla en el PDF
        await doc.table(tableData, {
            width: 500,
            align: 'center',
            columnSpacing: 10,
            padding: 5,
        });

        // Finalizar y cerrar el documento PDF
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
}

export default serviceSummaryPDF;
