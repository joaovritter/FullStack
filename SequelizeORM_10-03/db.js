import Sequelize from 'sequelize';

const sequelize = new Sequelize('crud_sequelize', 'root', 'www.com.brj', {
    host: '127.0.0.1',
    dialect: 'mysql'
}
);

export default sequelize;