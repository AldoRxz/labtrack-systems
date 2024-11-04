import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
    asset_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    maintenance_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    performed_by: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'maintenance_records',
    timestamps: false,
});

// Exportar el modelo como default
export default MaintenanceRecord;
