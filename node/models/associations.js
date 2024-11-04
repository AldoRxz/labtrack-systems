import Location from './Location.js';
import Asset from './Asset.js';
import AssetStatus from './AssetStatus.js'; 

// Relación entre location y Asset
Location.hasMany(Asset, { foreignKey: 'location_id', as: 'Assets' });
Asset.belongsTo(Location, { foreignKey: 'location_id' });

// Relación entre Asset y AssetStatus
Asset.hasOne(AssetStatus, { foreignKey: 'asset_id', as: 'Status' });
AssetStatus.belongsTo(Asset, { foreignKey: 'asset_id' });