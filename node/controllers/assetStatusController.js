import Location from '../models/Location.js';
import Asset from '../models/Asset.js';
import AssetStatus from '../models/AssetStatus.js';


export const getAllAssetStatus = async (req, res) => {
    try {
        const assetStatus = await AssetStatus.findAll();
        res.json(assetStatus);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los estados de activos' });
    }
};

export const createAssetStatus = async (req, res) => {
    try {
        const assetStatus = await AssetStatus.create(req.body);
        res.status(201).json(assetStatus);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el estado del activo' });
    }
};

export const getAssetStatusById = async (req, res) => {
    try {
        const status = await AssetStatus.findByPk(req.params.id);
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ error: 'Estado del activo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el estado del activo' });
    }
};

export const updateAssetStatus = async (req, res) => {
    try {
        const assetStatus = await AssetStatus.findByPk(req.params.id);
        if (assetStatus) {
            await assetStatus.update(req.body);
            res.json(assetStatus);
        } else {
            res.status(404).json({ error: 'Estado del activo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado del activo' });
    }
};

export const deleteAssetStatus = async (req, res) => {
    try {
        const assetStatus = await AssetStatus.findByPk(req.params.id);
        if (assetStatus) {
            await assetStatus.destroy();
            res.json({ message: 'Estado del activo eliminado' });
        } else {
            res.status(404).json({ error: 'Estado del activo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el estado del activo' });
    }
};
