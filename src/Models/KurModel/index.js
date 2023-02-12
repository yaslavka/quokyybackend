const sequelize = require("../../../db");
const {Zakaz} = require("../ZakazModels");
const {DataTypes} = require("sequelize");

const Kur = sequelize.define(
    "kerer",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11},
        first_name: {type: DataTypes.STRING, allowNull: false},
        last_name: {type: DataTypes.STRING, allowNull: false},
        phone: {type: DataTypes.STRING, allowNull: false},
        email: {type: DataTypes.STRING, allowNull: false},
        password: {type: DataTypes.STRING, allowNull: false},
        avatar: {type: DataTypes.STRING, defaultValue: null},
        balance: {type: DataTypes.DECIMAL(61, 2), defaultValue: 0.00, allowNull: false},
        finance_password: {type: DataTypes.STRING, defaultValue: null},
        income: {type: DataTypes.DECIMAL(61, 2), defaultValue: 0.00},
        description: {type: DataTypes.STRING, defaultValue: null},
        latitude:{type: DataTypes.DECIMAL(61, 15), defaultValue: 0.000000000000000, allowNull: false},
        longitude:{type: DataTypes.DECIMAL(61, 15), defaultValue: 0.000000000000000, allowNull: false},
        zakazId: {type: DataTypes.BIGINT, allowNull: true},
    },
);
Zakaz.hasMany(Kur, {as: "kerer"});
Kur.belongsTo(Zakaz, {as: 'order'});

module.exports = {Kur}
