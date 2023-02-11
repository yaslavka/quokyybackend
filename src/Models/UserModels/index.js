const sequelize = require("../../../db");
const {DataTypes} = require("sequelize");

const User = sequelize.define(
    "user",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11},
        first_name: {type: DataTypes.STRING, allowNull: false},
        last_name: {type: DataTypes.STRING, allowNull: false},
        phone: {type: DataTypes.STRING, allowNull: false},
        email: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        avatar: {type: DataTypes.STRING, defaultValue: null},
        balance: {type: DataTypes.INTEGER(61, 2), defaultValue: 0.00, allowNull: false},
        finance_password: {type: DataTypes.STRING, defaultValue: null},
        first_lines: {type: DataTypes.INTEGER, defaultValue: 0},
        income: {type: DataTypes.INTEGER, defaultValue: 0},
        description: {type: DataTypes.STRING, defaultValue: null},
        rolleadmin: {type: DataTypes.INTEGER, defaultValue: 0},
        rolleKorer: {type: DataTypes.INTEGER, defaultValue: 0},
    },
);

module.exports = {User}
