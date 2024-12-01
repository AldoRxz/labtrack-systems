import express from 'express';
import * as locationController from '../controllers/locationController.js';

const router = express.Router();

router.get('/details', locationController.getLocationsWithDetails);
router.get('/details/:id', locationController.getLocationDetailsById);
router.get('/search', locationController.searchAssets);
router.get('/', locationController.getAllLocations);
router.post('/', locationController.createLocation);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;