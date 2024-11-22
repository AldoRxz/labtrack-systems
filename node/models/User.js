import { DataTypes } from 'sequelize';
import sequelize from './index.js';

export const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'users', // Nombre de la tabla
        timestamps: false,  // Si no necesitas createdAt y updatedAt
    }
);
