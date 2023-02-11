const ApiError = require("../../error/ApiError");
const {User} = require('../../Models/UserModels/index')
const {Zakaz} = require('../../Models/ZakazModels/index')
const jwt = require("jsonwebtoken");

class ZakazController {
    async sozdatZakazy(req, res, next){
        console.log(req.body)
        const { authorization } = req.headers;
        const {   origin, distance, names, phone, dtae, comments, cena, namesp, cennost, strahovka, ves, type } = req.body;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        try {
            await Zakaz.create({

            })
        }catch (error){
            return next(ApiError.internal(error));
        }
    }
}
module.exports = new ZakazController();
