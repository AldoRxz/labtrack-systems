import {Location} from '../models/Location.js';
import { Asset } from '../models/Asset.js';

import { ObservationHistory} from '../models/ObservationHistory.js';
import { MaintenanceRecord} from '../models/MaintenanceRecord.js';

import { Op } from 'sequelize';



export const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las ubicaciones' });
    }
};

export const createLocation = async (req, res) => {
    try {
        const location = await Location.create(req.body);
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la ubicación' });
    }
};

export const getLocationById = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id, {
            include: [
                {
                    model: Asset,
                    as: 'assets', // Cambiado al alias correcto
                },
                {
                    model: Asset,
                    as: 'transferredAssets', // Para incluir también los transferidos
                },
            ],
        });

        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        res.status(500).json({ error: 'Error al obtener la ubicación' });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);
        if (location) {
            await location.update(req.body);
            res.json(location);
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la ubicación' });
    }
};

export const deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);
        if (location) {
            await location.destroy();
            res.json({ message: 'Ubicación eliminada' });
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la ubicación' });
    }
};


export const getLocationsWithDetails = async (req, res) => {
    try {
        const locations = await Location.findAll({
            include: [
                {
                    model: Asset,
                    as: 'assets', // Alias actualizado
                    include: [
                        {
                            model: ObservationHistory,
                            as: 'observations',
                        },
                        {
                            model: MaintenanceRecord,
                            as: 'maintenances',
                        },
                    ],
                },
                {
                    model: Asset,
                    as: 'transferredAssets', 
                    include: [
                        {
                            model: ObservationHistory,
                            as: 'observations',
                        },
                        {
                            model: MaintenanceRecord,
                            as: 'maintenances',
                        },
                    ],
                },
            ],
        });

        res.json(locations);
    } catch (error) {
        console.error('Error al obtener las ubicaciones con detalles:', error);
        res.status(500).json({ error: 'Error al obtener las ubicaciones con detalles' });
    }
};


export const getLocationDetailsById = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id, {
            include: [
                {
                    model: Asset,
                    as: 'assets', // Alias para activos originales
                    include: [
                        {
                            model: ObservationHistory,
                            as: 'observations',
                        },
                        {
                            model: MaintenanceRecord,
                            as: 'maintenances',
                        },
                    ],
                },
                {
                    model: Asset,
                    as: 'transferredAssets', 
                    include: [
                        {
                            model: ObservationHistory,
                            as: 'observations',
                        },
                        {
                            model: MaintenanceRecord,
                            as: 'maintenances',
                        },
                    ],
                },
            ],
        });

        if (location) {
            res.json(location);
        } else {
            res.status(404).json({ error: 'Ubicación no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la ubicación con detalles:', error);
        res.status(500).json({ error: 'Error al obtener la ubicación con detalles' });
    }
};



export const searchAssets = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'El término de búsqueda no puede estar vacío' });
        }

        const locations = await Location.findAll({
            include: [
                {
                    model: Asset,
                    as: 'assets', // Alias para activos originales
                    required: true,
                    where: {
                        [Op.or]: [
                            { descripcion: { [Op.like]: `%${query}%` } },
                            { marca: { [Op.like]: `%${query}%` } },
                            { modelo: { [Op.like]: `%${query}%` } },
                            { numero_de_serie: { [Op.like]: `%${query}%` } },
                        ],
                    },
                },
            ],
        });

        if (locations.length === 0) {
            return res.status(404).json({ message: 'No se encontraron resultados en los activos' });
        }

        res.json(locations);
    } catch (error) {
        console.error('Error en la búsqueda de activos:', error);
        res.status(500).json({ error: 'Error al realizar la búsqueda en activos' });
    }
};

