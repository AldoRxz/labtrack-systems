import express from 'express';
import * as locationController from '../controllers/locationController.js';

const router = express.Router();

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createLocation);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);
router.get('/details', locationController.getLocationsWithDetails);

export default router;