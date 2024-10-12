export const validateSchema = (schema) => (req, res, next) => {
    console.log('Datos recibidos del frontend:', req.body);  // Agrega este log para inspeccionar los datos

    try {
        schema.parse(req.body)
        next()
    }
    catch(error){
        console.log(error.errors); // Log the error to understand its structure
    
        if (error.errors && Array.isArray(error.errors)) {
            // If errors exist and it's an array, map over it
            return res.status(400).json(error.errors.map(err => err.message));
        } else {
            // Handle the case when error.errors is not defined or not an array
            return res.status(400).json({ message: 'Invalid request data', error });
        }
    }
};
