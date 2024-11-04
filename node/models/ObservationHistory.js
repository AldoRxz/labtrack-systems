import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const ObservationHistory = sequelize.define('ObservationHistory', {
    asset_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    observation: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    observed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    observed_by: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'observation_history',
    timestamps: false,
});

export default ObservationHistory;
