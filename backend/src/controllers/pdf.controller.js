import PDFDocument from 'pdfkit';

export const createPDF = async (req, res) => {
    console.log('Iniciando generación de PDF');
    try {
        // Crea un nuevo documento PDF
        const doc = new PDFDocument();

        // Configura el encabezado de la respuesta para indicar un archivo PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="archivo.pdf"');

        // Pipe el PDF directamente a la respuesta
        doc.pipe(res);

        // Escribir el contenido del PDF
        doc.fontSize(18).text('Ejemplo de PDF generado con pdfkit', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text('Este es un ejemplo de PDF generado dinámicamente.');
        doc.text('Puedes agregar más contenido aquí, como tablas, imágenes, etc.');

        console.log('PDF generado correctamente');
        doc.end();
    } catch (error) {
        console.error('Error detallado al generar el PDF:', error);
        res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
    }
};
