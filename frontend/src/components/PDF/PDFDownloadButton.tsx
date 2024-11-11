import React from 'react';
import axios from '../../api/axios';

interface ImagePDFDownloadButtonProps {
    pdfUrl: string;
    imageSrc: string;
    altText: string;
}

const ImagePDFDownloadButton: React.FC<ImagePDFDownloadButtonProps> = ({ pdfUrl, imageSrc, altText }) => {
    const handleDownload = async () => {
        try {
            const response = await axios.get(pdfUrl, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'documento.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
            alert('Hubo un error al descargar el PDF. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <img
        src={imageSrc}
        alt={altText}
        onClick={handleDownload}
        style={{ cursor: 'pointer' }}
        />
    );
};

export default ImagePDFDownloadButton;
