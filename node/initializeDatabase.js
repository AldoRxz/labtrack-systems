import sequelize from 'database/db.js'; 

import 'models/Asset.js'; 
import 'models/Location.js';
import 'models/ObservationHistory.js';
import 'models/MaintenanceRecord.js';

import 'models/relationships.js'; 

const initializeDatabase = async () => {
  try {
    const dbName = 'labtrack_systems';
    const dbConnection = await sequelize.getQueryInterface();
    await dbConnection.createDatabase(dbName, { charset: 'utf8', collate: 'utf8_general_ci' });

    console.log(`Database "${dbName}" created successfully.`);

    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully with all models and relationships.');

    process.exit(0); // Finaliza el proceso
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError' && error.parent.code === 'ER_DB_CREATE_EXISTS') {
      console.log(`Database "${dbName}" already exists. Proceeding with synchronization...`);
      await sequelize.sync({ force: true });
      console.log('Database synchronized successfully with all models and relationships.');
    } else {
      console.error('Error during database initialization:', error);
    }
    process.exit(1); // Finaliza el proceso con error
  }
};

initializeDatabase();
