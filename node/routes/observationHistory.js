import express from 'express';
import * as observationHistoryController from '../controllers/observationHistoryController.js';

const router = express.Router();

router.get('/', observationHistoryController.getAllObservationHistory);
router.post('/', observationHistoryController.createObservationHistory);
router.get('/:id', observationHistoryController.getObservationHistoryById);
router.put('/:id', observationHistoryController.updateObservationHistory);
router.delete('/:id', observationHistoryController.deleteObservationHistory);

export default router;