const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('license', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    resume_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "공고번호",
      references: {
        model: 'resume',
        key: 'id'
      }
    },
    license_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "자격증명"
    },
    publisher: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "발행처"
    },
    pass_date: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'license',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "license_FK",
        using: "BTREE",
        fields: [
          { name: "resume_id" },
        ]
      },
    ]
  });
};
