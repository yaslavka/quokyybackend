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
            const { email } = jwt.decode(token);
            let user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.internal("Такой пользователь не найден"));
            }
            await Zakaz.create({
                latitude: distance.latitude,
                longitude: distance.longitude,
                addresss: distance.address,
                streets: distance.name,
                latitudes: origin.latitude,
                longitudes: origin.longitude,
                address: origin.address,
                street: origin.name,
                nameuser: names,
                phone: phone,
                datetime: dtae,
                poruchenie: comments,
                summ: cena,
                cennost: cennost,
                strahovka: strahovka,
                namesgruz: namesp,
                ves: ves,
                typedostav: type,
                userId: user.id
            })
        }catch (error){
            return next(ApiError.internal(error));
        }
    }
}
module.exports = new ZakazController();
