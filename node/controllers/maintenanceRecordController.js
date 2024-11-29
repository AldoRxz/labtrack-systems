import { MaintenanceRecord } from '../models/MaintenanceRecord.js';

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
        const { asset_id, description, cost, performed_by, created_by } = req.body;

        // Validar datos
        if (!asset_id || !description || !cost || !performed_by ) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Crear el registro de mantenimiento
        const newMaintenanceRecord = await MaintenanceRecord.create({
            asset_id,
            description,
            cost,
            performed_by,
            created_by,
            maintenance_date: new Date(), // Fecha actual por defecto
        });

        res.status(201).json(newMaintenanceRecord);
    } catch (error) {
        console.error('Error al crear el registro de mantenimiento:', error);
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
