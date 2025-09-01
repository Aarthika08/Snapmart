const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    //id, name, email, profile_picture,phone,bio,role,city,state,postal_code,website,created_at
    role:{
  type: DataTypes.STRING,
      allowNull: true,
    },
    address:{
    type: DataTypes.STRING,
      allowNull: true,
    },
    city:{
  type: DataTypes.STRING,
      allowNull: true,
    },
    state:{
  type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code:{
        type: DataTypes.STRING,
      allowNull: true,
    },
    website:{  type: DataTypes.STRING,
      allowNull: true,},
    created_at:{
        type: DataTypes.STRING,
      allowNull: true,
    }



  },
  {
    tableName: "users",
    timestamps: true, // so createdAt & updatedAt are available
    underscored: true, // so fields match DB like created_at, updated_at
  }
);

module.exports = User;
