import Location from '../models/Location.js';
import Asset from '../models/Asset.js';

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
                    as: 'Assets',
                    include: [
                        {
                            model: AssetStatus,
                            as: 'Status'
                        }
                    ]
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
