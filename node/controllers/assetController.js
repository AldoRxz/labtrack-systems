import {Asset} from '../models/Asset.js';
import { ObservationHistory } from '../models/ObservationHistory.js';
import { MaintenanceRecord } from '../models/MaintenanceRecord.js';

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
    const { descripcion, marca, modelo, numero_de_serie, numero_de_activo, cog, resguardante, status, icon, location_id } = req.body;
    try {
      const newAsset = await Asset.create({
        descripcion,
        marca,
        modelo,
        numero_de_serie,
        numero_de_activo,
        cog,
        resguardante,
        status,
        icon,
        location_id,
      });
      res.status(201).json(newAsset);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el equipo' });
    }
  };

  export const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: ObservationHistory,
                    as: 'observations', // Alias definido en las asociaciones
                },
                {
                    model: MaintenanceRecord,
                    as: 'maintenances', // Alias definido en las asociaciones
                },
            ],
        });

        if (!asset) {
            return res.status(404).json({ error: 'Activo no encontrado' });
        }

        res.json(asset);
    } catch (error) {
        console.error('Error al obtener el activo:', error);
        res.status(500).json({ error: 'Error al obtener el activo' });
    }
};

// Actualizar un activo por ID
export const updateAsset = async (req, res) => {
  const {
    descripcion,
    marca,
    modelo,
    numero_de_serie,
    numero_de_activo,
    cog,
    resguardante,
    status,
    icon, 
    location_transfer,
  } = req.body;

  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Equipo no encontrado" });
    }

    await asset.update({
      descripcion,
      marca,
      modelo,
      numero_de_serie,
      numero_de_activo,
      cog,
      resguardante,
      status,
      icon, 
      location_transfer,
    });

    res.status(200).json(asset);
  } catch (error) {
    console.error("Error al actualizar el equipo:", error); // Log detallado del error
    res.status(500).json({ error: "Error al actualizar el equipo" });
  }
};


// Eliminar un activo por ID junto con relaciones
export const deleteAsset = async (req, res) => {
  try {
      const asset = await Asset.findByPk(req.params.id, {
          include: [
              { association: 'observations' },
              { association: 'maintenances' }
          ]
      });

      if (asset) {
          // Elimina observaciones y mantenimientos relacionados primero
          await Promise.all([
              ...asset.observations.map(observation => observation.destroy()),
              ...asset.maintenances.map(maintenance => maintenance.destroy())
          ]);

          // Luego elimina el activo
          await asset.destroy();
          res.json({ message: 'Activo y relaciones eliminados' });
      } else {
          res.status(404).json({ error: 'Activo no encontrado' });
      }
  } catch (error) {
      console.error("Error al eliminar el activo:", error);
      res.status(500).json({ error: 'Error al eliminar el activo' });
  }
};

