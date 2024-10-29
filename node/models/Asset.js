import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Asset = sequelize.define('Asset', {
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    location_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
    }
}, {
    tableName: 'assets',
    timestamps: false,
});

export default Asset;
