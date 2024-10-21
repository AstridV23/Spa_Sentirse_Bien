import PDFDocument from 'pdfkit';

export const createPDF = (req, res) => {
    console.log('Iniciando generación de PDF');
    const { tipo } = req.params;
    
    try {
        // Crea un nuevo documento PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${tipo}.pdf"`);
        doc.pipe(res);

        // Configurar el estilo del texto
        doc.font('Helvetica-Bold');
        doc.fontSize(24);

        let mensaje;
        switch(tipo) {
            case 'usuarios':
                mensaje = 'Estos son los resultados de usuarios';
                break;
            case 'turnos':
                mensaje = 'Estos son los resultados de turnos';
                break;
            case 'pagos':
                mensaje = 'Estos son los resultados de pagos';
                break;
            default:
                mensaje = `Tipo de reporte: ${tipo}`;
        }

        // Calcular el ancho del texto para centrarlo
        const textWidth = doc.widthOfString(mensaje);
        const pageWidth = doc.page.width;
        const xPosition = (pageWidth - textWidth) / 2;

        // Posicionar el texto en el centro de la página
        doc.text(mensaje, xPosition, 300);

        console.log(`PDF con tipo "${tipo}" generado correctamente`);
        doc.end();
    } catch (error) {
        console.error('Error detallado al generar el PDF:', error);
        res.status(500).json({ message: 'Error al generar el PDF', error: error.message });
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