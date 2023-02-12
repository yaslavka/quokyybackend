const sequelize = require("../../../db");
const {Kur} = require("../KurModel");
const {DataTypes} = require("sequelize");

const KurerDocuments = sequelize.define("document",
    {
        id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: 11},
        passportRszvorot: {type: DataTypes.STRING, defaultValue: null},
        passportPropiska: {type: DataTypes.STRING, defaultValue: null},
        passportSelfi: {type: DataTypes.STRING, defaultValue: null},
        address: {type: DataTypes.STRING, defaultValue: null},
        status: {type: DataTypes.BOOLEAN, defaultValue: false},
        kurId:{type: DataTypes.BIGINT, allowNull: false},
})
Kur.hasMany(KurerDocuments, {as: "document"});
KurerDocuments.belongsTo(Kur, {as: 'kerer'});
module.exports = {KurerDocuments}
