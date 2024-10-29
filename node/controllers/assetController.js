import Asset from '../models/Asset.js';

// Obtener todos los activos
export const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.findAll();
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los activos' });
    }
};

// Crear un nuevo activo
export const createAsset = async (req, res) => {
    try {
        const asset = await Asset.create(req.body);
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el activo' });
    }
};

// Obtener un activo por ID
export const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (asset) {
            res.json(asset);
        } else {
            res.status(404).json({ error: 'Activo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el activo' });
    }
};

// Actualizar un activo por ID
export const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (asset) {
            await asset.update(req.body);
            res.json(asset);
        } else {
            res.status(404).json({ error: 'Activo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el activo' });
    }
};

// Eliminar un activo por ID
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (asset) {
            await asset.destroy();
            res.json({ message: 'Activo eliminado' });
        } else {
            res.status(404).json({ error: 'Activo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el activo' });
    }
};