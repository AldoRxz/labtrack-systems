import MaintenanceRecord from '../models/MaintenanceRecord.js';

export const getAllMaintenanceRecords = async (req, res) => {
    try {
        const records = await MaintenanceRecord.findAll();
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los registros de mantenimiento' });
    }
};

export const createMaintenanceRecord = async (req, res) => {
    try {
        const record = await MaintenanceRecord.create(req.body);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el registro de mantenimiento' });
    }
};

export const getMaintenanceRecordById = async (req, res) => {
    try {
        const record = await MaintenanceRecord.findByPk(req.params.id);
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: 'Registro de mantenimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el registro de mantenimiento' });
    }
};

export const updateMaintenanceRecord = async (req, res) => {
    try {
        const record = await MaintenanceRecord.findByPk(req.params.id);
        if (record) {
            await record.update(req.body);
            res.json(record);
        } else {
            res.status(404).json({ error: 'Registro de mantenimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro de mantenimiento' });
    }
};

export const deleteMaintenanceRecord = async (req, res) => {
    try {
        const record = await MaintenanceRecord.findByPk(req.params.id);
        if (record) {
            await record.destroy();
            res.json({ message: 'Registro de mantenimiento eliminado' });
        } else {
            res.status(404).json({ error: 'Registro de mantenimiento no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el registro de mantenimiento' });
    }
};
