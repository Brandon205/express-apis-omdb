'use strict';
module.exports = (sequelize, DataTypes) => {
  const fave = sequelize.define('fave', {
    imdbid: DataTypes.STRING,
    title: DataTypes.STRING
  }, {});
  fave.associate = function(models) {
    // associations can be defined here
  };
  return fave;
};