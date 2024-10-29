import express from 'express';
import * as assetController from '../controllers/assetController.js';

const router = express.Router();

// Rutas CRUD para Assets
router.get('/', assetController.getAllAssets);
router.post('/', assetController.createAsset);
router.get('/:id', assetController.getAssetById);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

export default router;