import Location from './Location.js';
import Asset from './Asset.js';

// Relación entre location y Asset
Location.hasMany(Asset, { foreignKey: 'location_id', as: 'Assets' });
Asset.belongsTo(Location, { foreignKey: 'location_id' });
