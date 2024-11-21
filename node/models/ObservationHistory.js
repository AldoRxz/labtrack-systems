import { DataTypes } from 'sequelize';
import sequelize from './index.js';

export const ObservationHistory = sequelize.define('ObservationHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    asset_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    observation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    observed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    observed_by: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'observation_history',
    timestamps: false, // Desactiva los timestamps
});