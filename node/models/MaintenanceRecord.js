import { DataTypes } from 'sequelize';
import sequelize from './index.js';


export const MaintenanceRecord = sequelize.define(
    'MaintenanceRecord',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        asset_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        maintenance_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cost: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        performed_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
    },
    {
        tableName: 'maintenance_records', // Nombre exacto de la tabla
        timestamps: false, // No hay columnas createdAt y updatedAt
    }
);