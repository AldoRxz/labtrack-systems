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
    type: DataTypes.STRING,
    allowNull: true,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero_de_serie: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero_de_activo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cog: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resguardante: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  icon: { // Campo nuevo
    type: DataTypes.STRING,
    allowNull: true,
  },
  location_id: {
    type: DataTypes.BIGINT,
    references: {
      model: 'locations',
      key: 'id',
    },
  },
  location_transfer: { 
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'locations', 
      key: 'id',
    },
  },
}, {
  tableName: 'assets',
  timestamps: false,
});

