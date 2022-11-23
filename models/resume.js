const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('resume', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    job_title_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "공고번호",
      references: {
        model: 'job_posts',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "지원자",
      references: {
        model: 'users',
        key: 'id'
      }
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "지원현황"
    },
    resume_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "성별"
    },
    birth_day: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "증명사진"
    },
    zip_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    detail_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "상세주소"
    },
    job1_depth1: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "1차 희망 대분류"
    },
    job1_depth2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "1차 희망 소분류"
    },
    job2_depth1: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "2차 희망 대분류"
    },
    job2_depth2: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "2차 희망 소분류"
    },
    workday: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "근무가능요일"
    },
    start_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "근무가능시간(시)"
    },
    end_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "근무가능시간(분)"
    },
    bank: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "은행"
    },
    account_number: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: "계좌번호"
    },
    education: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "최종학력"
    },
    school_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "학교명"
    },
    major: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "전공"
    },
    graduation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "졸업년도"
    },
    graduation_category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "졸업구분"
    },
    military_service: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "병역여부"
    },
    disabled: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "장애여부"
    },
    self_introducation: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'resume',
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
      {
        name: "tempsave_profile_FK",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "tempsave_profile_FK_1",
        using: "BTREE",
        fields: [
          { name: "job_title_id" },
        ]
      },
    ]
  });
};
