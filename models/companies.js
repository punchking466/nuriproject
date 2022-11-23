const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('companies', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    company_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "회사명"
    },
    company_phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "회사번호"
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "우편번호"
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "주소"
    },
    detail_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "상세주소"
    },
    fax: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "팩스번호"
    },
    ceo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "대표명"
    },
    business_num: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bank: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "은행"
    },
    account_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "계좌번호"
    }
  }, {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
