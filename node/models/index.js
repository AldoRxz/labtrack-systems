// Conection to AWS RDS

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('labtrack_systems', 'admin', 'test1234', {
    host: 'labtrack-systems.chmaoa2mmf1n.us-east-2.rds.amazonaws.com',
    dialect: 'mysql',
    port: 3306, // Puerto de MySQL
    logging: false, // Opcional: para desactivar logs en consola
});

export default sequelize;



// Conection to local database

// import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize('labtrack_systems', 'root', 'root', {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging: false, 
// });

// export default sequelize;