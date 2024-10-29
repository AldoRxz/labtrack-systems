import express from 'express';
import cors from 'cors';
import assetRoutes from './routes/assets.js';

const app = express();

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/assets', assetRoutes);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});