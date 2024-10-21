import { z } from 'zod';
import Service from "../models/service_model.js";
import { createServiceSchema } from '../schemas/service.schema.js';

export const createService = async (req, res) => {
    try {
        // Validar los datos de entrada usando el schema de Zod
        const validatedData = createServiceSchema.parse(req.body);

        const encargado = await User.findById(validatedData.encargado.id);
        if (!encargado) {
            return res.status(404).json({ message: "Encargado no encontrado" });
        }

        // Crear un array con las horas predeterminadas
        const defaultHours = [
            "09:00", "10:00", "11:00", "12:00", "13:00", 
            "14:00", "15:00", "16:00", "17:00", "18:00"
        ];

        // Crear el nuevo servicio con los datos validados
        const newService = new Service({
            service_name: validatedData.service_name,
            service_type: validatedData.service_type,
            service_description: validatedData.service_description,
            service_price: validatedData.service_price,
            encargado: validatedData.encargado.id, // Guardamos solo el ID del encargado
            hours: defaultHours
        });

        const savedService = await newService.save();

        res.status(201).json({
            message: "Servicio creado exitosamente",
            service: {
                id: savedService._id,
                service_name: savedService.service_name,
                service_type: savedService.service_type,
                service_description: savedService.service_description,
                service_price: savedService.service_price,
                encargado: {
                    id: validatedData.encargado.id,
                    name: validatedData.encargado.name,
                    email: validatedData.encargado.email
                }
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Error de validación del schema
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: error.errors 
            });
        }
        console.error('Error al crear el servicio:', error);
        res.status(500).json({ message: 'Error al crear el servicio.', error: error.message });
    }
};

export const getServices = async (req, res) => {
    try {
        const services = await Service.find()

        if(!services) return res.status(404).json({message: "Error al obtener los servicios"})

        res.json(services)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Servicio.', error });
    }
}

export const updateServiceHours = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { currentHour, newHour } = req.body;

        // Validar el formato de las horas
        const horaValida = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!horaValida.test(currentHour) || !horaValida.test(newHour)) {
            return res.status(400).json({ message: "Formato de hora inválido. Use HH:MM." });
        }

        // Buscar el servicio
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }

        // Verificar si la hora actual existe en el array de horas
        const index = service.hours.indexOf(currentHour);
        if (index === -1) {
            return res.status(400).json({ message: "La hora actual no existe en el servicio." });
        }

        // Verificar si la nueva hora ya existe en el array
        if (service.hours.includes(newHour)) {
            return res.status(400).json({ message: "La nueva hora ya existe en el servicio." });
        }

        // Reemplazar la hora actual con la nueva hora
        service.hours[index] = newHour;

        // Ordenar el array de horas
        service.hours.sort();

        // Guardar los cambios
        await service.save();

        res.status(200).json({
            message: "Horario actualizado exitosamente",
            updatedHours: service.hours
        });
    } catch (error) {
        console.error('Error al actualizar el horario del servicio:', error);
        res.status(500).json({ message: 'Error al actualizar el horario del servicio.', error: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar los datos de entrada usando el schema de Zod
        const validatedData = createServiceSchema.parse(req.body);

        // Buscar el servicio por ID y actualizarlo
        const updatedService = await Service.findByIdAndUpdate(id, validatedData, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        res.status(200).json({
            message: "Servicio actualizado exitosamente",
            service: {
                id: updatedService._id,
                service_name: updatedService.service_name,
                service_type: updatedService.service_type,
                service_description: updatedService.service_description,
                service_price: updatedService.service_price,
                encargado: updatedService.encargado,
                hours: updatedService.hours
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Error de validación del schema
            return res.status(400).json({ 
                message: "Error de validación", 
                errors: error.errors 
            });
        }
        console.error('Error al actualizar el servicio:', error);
        res.status(500).json({ message: 'Error al actualizar el servicio.', error: error.message });
    }
};