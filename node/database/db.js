import { Sequelize } from 'sequelize';

const db = new Sequelize('labtrack_systems', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, 
});

export default db;