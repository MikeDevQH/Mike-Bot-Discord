const mongoose = require('mongoose');

// Cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// Obtener la URI de MongoDB desde las variables de entorno
const mongoURI = process.env.MONGO_URI;

// Función para conectar a la base de datos MongoDB
const connectDB = async () => {
    try {
        // Intentar conectar a MongoDB con la URI proporcionada
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (err) {
        // Imprimir cualquier error que ocurra durante la conexión y salir del proceso con un error
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
