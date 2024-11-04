import express from 'express';
import * as maintenanceRecordController from '../controllers/maintenanceRecordController.js';

const router = express.Router();

router.get('/', maintenanceRecordController.getAllMaintenanceRecords);
router.post('/', maintenanceRecordController.createMaintenanceRecord);
router.get('/:id', maintenanceRecordController.getMaintenanceRecordById);
router.put('/:id', maintenanceRecordController.updateMaintenanceRecord);
router.delete('/:id', maintenanceRecordController.deleteMaintenanceRecord);

export default router;