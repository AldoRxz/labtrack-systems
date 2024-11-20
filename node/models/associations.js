import { Asset } from './Asset.js';
import { Location } from './Location.js';
import { ObservationHistory } from './ObservationHistory.js';
import { MaintenanceRecord } from './MaintenanceRecord.js';


// Relación entre Location y Asset
Location.hasMany(Asset, { foreignKey: 'location_id', as: 'assets' });
Asset.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });


// Relación entre Asset y ObservationHistory
Asset.hasMany(ObservationHistory, { foreignKey: 'asset_id', as: 'observations' });
ObservationHistory.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });

// Relación entre Asset y MaintenanceRecord
Asset.hasMany(MaintenanceRecord, { foreignKey: 'asset_id', as: 'maintenances' });
MaintenanceRecord.belongsTo(Asset, { foreignKey: 'asset_id', as: 'asset' });