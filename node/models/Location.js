const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
}, {
    tableName: 'locations',
    timestamps: false,
});

module.exports = Location;