import express from 'express';
import cors from 'cors';

import './models/associations.js'; 

import assetRoutes from './routes/assets.js';
import maintenanceRecordRoutes from './routes/maintenanceRecords.js';
import locationRoutes from './routes/locations.js';
import observationHistoryRoutes from './routes/observationHistory.js';
import userRoutes from './routes/user.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/assets', assetRoutes);
app.use('/api/maintenance-records', maintenanceRecordRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/observation-history', observationHistoryRoutes);
app.use('/api/users', userRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`URL para acceder: http://localhost:${PORT}`);
});