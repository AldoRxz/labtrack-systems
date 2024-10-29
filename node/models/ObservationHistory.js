const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const ObservationHistory = sequelize.define('ObservationHistory', {
    asset_id: DataTypes.BIGINT,
    observation: DataTypes.TEXT,
    observed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    observed_by: DataTypes.STRING,
}, {
    tableName: 'observation_history',
    timestamps: false,
});

module.exports = ObservationHistory;