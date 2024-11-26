import { DataTypes } from 'sequelize';
import sequelize from './index.js';

export const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    classroom: {
        type: DataTypes.STRING, // Refleja el nuevo campo en MySQL
        allowNull: true,        // Permitir nulos si no es obligatorio
    },
    piso: {
        type: DataTypes.INTEGER, // Nueva columna "piso"
        allowNull: false,
    },
}, {
    tableName: 'locations',
    timestamps: false,
});
