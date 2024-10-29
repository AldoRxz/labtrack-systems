const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const AssetStatus = sequelize.define('AssetStatus', {
    asset_id: DataTypes.BIGINT,
    status: DataTypes.STRING,
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'asset_status',
    timestamps: false,
});

module.exports = AssetStatus;
