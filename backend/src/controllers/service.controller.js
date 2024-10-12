import Service from "../models/service_model.js";

export const createService = async (req, res) => {
    try {
        const { service_name, service_type, service_description, service_price  } = req.body;

        // Validación de campos requeridos
        if (!service_name || !service_description) {
            return res.status(400).json({ message: 'Title y description son requeridos.' });
        }

        const newService = new Service({
            service_name,
            service_type,
            service_description,
            service_price
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el servicio.', error });
    }
};