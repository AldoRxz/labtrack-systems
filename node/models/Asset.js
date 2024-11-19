import { DataTypes } from 'sequelize';
import sequelize from './index.js';

export const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  marca: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  modelo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  numero_de_serie: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  numero_de_activo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cog: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resguardante: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  location_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'Locations',
      key: 'id',
    },
  },
}, {
  tableName: 'assets',
  timestamps: false, // Desactiva createdAt y updatedAt
});

