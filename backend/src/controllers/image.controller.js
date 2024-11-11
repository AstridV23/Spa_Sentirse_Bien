import Image from '../models/images_model.js';

// Método para crear una nueva imagen
export const createImage = async (req, res) => {
    try {
        const { url } = req.body;
        
        const newImage = new Image({ url });
        const savedImage = await newImage.save();
        
        res.status(201).json({
            message: "Imagen creada exitosamente",
            image: savedImage
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al crear la imagen",
            error: error.message
        });
    }
};

// Método para eliminar una imagen
export const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedImage = await Image.findByIdAndDelete(id);
        
        if (!deletedImage) {
            return res.status(404).json({
                message: "Imagen no encontrada"
            });
        }
        
        res.status(200).json({
            message: "Imagen eliminada exitosamente",
            image: deletedImage
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la imagen",
            error: error.message
        });
    }
};

export const getAllImages = async (req, res) => {
    try {
        const images = await Image.find();
        
        res.status(200).json({
            message: "Imágenes obtenidas exitosamente",
            count: images.length,
            images: images
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las imágenes",
            error: error.message
        });
    }
};

