//models/index
const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  User: require('./user')(sequelize, Sequelize),
  List: require('./list')(sequelize, Sequelize),
  Task: require('./task')(sequelize, Sequelize),
};

Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = {
  ...models,
  sequelize,
  Sequelize,
};
