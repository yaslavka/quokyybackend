const sequelize = require("../../../db");
const {Kur} = require("../KurModel");
const {User} = require("../UserModels");
const {DataTypes} = require("sequelize");

const Kurrerhystory = sequelize.define("orderhysorykur", {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11},
    //куда отвезти
    latitude:{type: DataTypes.DECIMAL(61, 15), defaultValue: 0.000000000000000, allowNull: false},
    longitude:{type: DataTypes.DECIMAL(61, 15), defaultValue: 0.000000000000000, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    street: {type: DataTypes.STRING, allowNull: false},
    //откуда забрать
    latitudes:{type: DataTypes.DECIMAL(61, 15), defaultValue: 0.000000000000000, allowNull: false},
    longitudes:{type: DataTypes.DECIMAL(61, 15), defaultValue: 0.000000000000000, allowNull: false},
    addresss: {type: DataTypes.STRING, allowNull: false},
    streets: {type: DataTypes.STRING, allowNull: false},
    //Вес
    ves: {type: DataTypes.DECIMAL(61, 3), defaultValue: 0.000, allowNull: false},
    //Тип доставки
    namesgruz:{type: DataTypes.STRING, allowNull: false},
    typedostav: {type: DataTypes.STRING, defaultValue: null},
    nameuser: {type: DataTypes.STRING, defaultValue: null},
    poruchenie:{type: DataTypes.STRING, defaultValue: null},
    datetime:{type: DataTypes.DATE, allowNull: false},
    phone: {type: DataTypes.STRING, defaultValue: null},
    strahovka:  {type: DataTypes.DECIMAL(61, 2), defaultValue: 0.00, allowNull: false},
    cennost:  {type: DataTypes.DECIMAL(61, 2), defaultValue: 0.00, allowNull: false},
    summ:  {type: DataTypes.DECIMAL(61, 2), defaultValue: 0.00, allowNull: false},
    //поиск куръера
    status1:{type: DataTypes.BOOLEAN, defaultValue: false},
    //в работе
    status2:{type: DataTypes.BOOLEAN, defaultValue: false},
    //выполнен
    status3:{type: DataTypes.BOOLEAN, defaultValue: false},
    status4:{type: DataTypes.BOOLEAN, defaultValue: false},
    status5:{type: DataTypes.BOOLEAN, defaultValue: false},
    kererId: {type: DataTypes.BIGINT, allowNull: false},

})
Kur.hasMany(Kurrerhystory, {as: "orderhysorykur"});
Kurrerhystory.belongsTo(User, {as: 'kerer'});
module.exports = {Kurrerhystory}
