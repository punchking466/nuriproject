const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('career', {
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
    career_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "업체명"
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "고용형태"
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "근무시작일"
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "근무종료일"
    },
    salary: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "연봉"
    },
    job: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "직무"
    },
    job_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "직무설명"
    }
  }, {
    sequelize,
    tableName: 'career',
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
        name: "career_FK",
        using: "BTREE",
        fields: [
          { name: "resume_id" },
        ]
      },
    ]
  });
};
