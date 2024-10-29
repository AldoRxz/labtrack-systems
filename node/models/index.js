import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('labtrack_systems', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, 
});

export default sequelize;