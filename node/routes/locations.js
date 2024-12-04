import express from 'express';
import * as locationController from '../controllers/locationController.js';

const router = express.Router();

//aqui filtra los equipos por parametros en la barra de busqueda
router.get('/search', locationController.searchAssets);
// aqui se arma el exel con toda la informacion
router.get('/details', locationController.getLocationsWithDetails);
// aqui se arma el exel con la informacion de una locacion especifica
router.get('/details/:id', locationController.getLocationDetailsById);

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createLocation);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;