/// models/list.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  List.associate = (models) => {
    List.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
    List.hasMany(models.Task, { onDelete: 'CASCADE', as: 'Tasks' }); // Add the alias 'Tasks'
  };

  return List;
};
