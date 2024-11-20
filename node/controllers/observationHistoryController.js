import {ObservationHistory} from '../models/ObservationHistory.js';

export const getAllObservationHistory = async (req, res) => {
    try {
        const history = await ObservationHistory.findAll();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de observaciones' });
    }
};

export const createObservationHistory = async (req, res) => {
    try {
        const history = await ObservationHistory.create(req.body);
        res.status(201).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el historial de observación' });
    }
};

export const getObservationHistoryById = async (req, res) => {
    try {
        const history = await ObservationHistory.findByPk(req.params.id);
        if (history) {
            res.json(history);
        } else {
            res.status(404).json({ error: 'Historial de observación no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de observación' });
    }
};

export const updateObservationHistory = async (req, res) => {
    try {
        const history = await ObservationHistory.findByPk(req.params.id);
        if (history) {
            await history.update(req.body);
            res.json(history);
        } else {
            res.status(404).json({ error: 'Historial de observación no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el historial de observación' });
    }
};

export const deleteObservationHistory = async (req, res) => {
    try {
        const history = await ObservationHistory.findByPk(req.params.id);
        if (history) {
            await history.destroy();
            res.json({ message: 'Historial de observación eliminado' });
        } else {
            res.status(404).json({ error: 'Historial de observación no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el historial de observación' });
    }
};
