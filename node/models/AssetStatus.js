import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const AssetStatus = sequelize.define('AssetStatus', {
    asset_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    status: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    tableName: 'asset_status',
    timestamps: false,
});

export default AssetStatus;
