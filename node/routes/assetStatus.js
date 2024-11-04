import express from 'express';
import * as assetStatusController from '../controllers/assetStatusController.js';

const router = express.Router();

router.get('/', assetStatusController.getAllAssetStatus);
router.post('/', assetStatusController.createAssetStatus);
router.get('/:id', assetStatusController.getAssetStatusById);
router.put('/:id', assetStatusController.updateAssetStatus);
router.delete('/:id', assetStatusController.deleteAssetStatus);

export default router;