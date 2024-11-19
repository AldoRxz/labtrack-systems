import { Asset } from './Asset.js'; // Importación con nombre
import { Location } from './Location.js';

Location.hasMany(Asset, { foreignKey: 'location_id', as: 'assets' });
Asset.belongsTo(Location, { foreignKey: 'location_id', as: 'location' });
