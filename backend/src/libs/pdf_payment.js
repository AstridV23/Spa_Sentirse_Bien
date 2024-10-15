import PDFDocument from "pdfkit";

// Función para crear la tabla de la factura
export const createInvoiceTable = (doc, DatosTurno) => {
    // Verificar que DatosTurno y servicio estén definidos y sean válidos
    if (!DatosTurno || !DatosTurno.servicio) {
        console.error("DatosTurno o servicio no están definidos correctamente", DatosTurno);
        return; // O lanza un error
    }

    const table = {
        headers: ['Servicio', 'Precio'],
        rows: [
            [DatosTurno.servicio, DatosTurno.precio || "Precio no disponible"] // Ajusta según lo que tengas
        ]
    };

    // Añadir encabezados
    doc.fontSize(12).text(table.headers[0], { continued: true }).text(table.headers[1]);

    // Añadir filas
    table.rows.forEach(row => {
        doc.text(row[0], { continued: true }).text(row[1]);
    });
};

// Función para generar el PDF de pago
const generatePDFPayment = async (req, res) => {
    const { tarjeta, DatosTurno } = req.body;

    try {
        // Crear el documento PDF
        const doc = new PDFDocument();

        // Establecer la respuesta para descargar el PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=factura.pdf");

        // Stream del PDF hacia la respuesta
        doc.pipe(res);

        // Agregar título y detalles
        doc.fontSize(25).text("Factura", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Fecha: ${DatosTurno.formattedDate}`);
        doc.text(`Hora: ${DatosTurno.hora}`);
        doc.text(`Servicio: ${DatosTurno.servicio}`);
        doc.text(`Tratamiento: ${DatosTurno.tipoTratamiento}`);
        doc.text(`Información: ${DatosTurno.informacion}`);
        doc.moveDown();
        doc.text("Información de Pago:");
        doc.text(`Número de tarjeta: ${tarjeta.numero}`);
        doc.text(`Nombre del propietario: ${tarjeta.prop}`);
        doc.text(`CUIL: ${tarjeta.cuil}`);
        
        // Agregar tabla
        createInvoiceTable(doc, DatosTurno);

        // Finalizar el PDF
        doc.end();
    } catch (error) {
        console.error("Error al generar la factura:", error.message);
        res.status(500).json({ message: "Error al generar la factura", error: error.stack });
    }    
};

// Exportar por defecto la función de generación de PDF
export default generatePDFPayment;
