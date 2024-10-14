import PDFDocument from "pdfkit-table"

export function buildPDF(dataCallback, endCallback) {
    
    // crea el objeto documento
    const doc = new PDFDocument()

    doc.on("data", dataCallback) //envia los datos al cliente en tiempo real a medida que se generan fragmentos de datos PDF
    doc.on("end", endCallback) //se ejecuta cuando el documento PDF ha terminado de generarse

    doc.text("Hello World!")

    // ejemplo de tabla
    const tableArray = {
        headers: ["Country", "Conversion rate", "Trend"],
        rows: [
            ["Switzerland", "12%", "+1.12%"],
            ["France", "67%", "-0.98%"],
            ["England", "33%", "+4.44%"],
        ],
    };
    doc.table( tableArray, { width: 500 });

    // finalizar el documento
    doc.end()
}