const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
    asset_id: DataTypes.BIGINT,
    maintenance_date: DataTypes.DATE,
    description: DataTypes.TEXT,
    cost: DataTypes.DECIMAL(10, 2),
    performed_by: DataTypes.STRING,
}, {
    tableName: 'maintenance_records',
    timestamps: false,
});

module.exports = MaintenanceRecord;
