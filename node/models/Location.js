import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Location = sequelize.define('Location', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    piso: {
        type: DataTypes.INTEGER, // Nueva columna "piso"
        allowNull: false,
    },
}, {
    tableName: 'locations',
    timestamps: false,
});

export default Location;
