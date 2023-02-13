const ApiError = require("../../error/ApiError");
const {User} = require('../../Models/UserModels/index')
const {Zakaz} = require('../../Models/ZakazModels/index')
const jwt = require("jsonwebtoken");
const {Kur} = require("../../Models/KurModel");



class ZakazController {
    async sozdatZakazy(req, res, next){
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
    async myZakaz (req, res, next){
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal("Такой пользователь не найден"));
        }
        if (user){
            const zakaz = await Zakaz.findAll({where:{userId: user.id}})
            return res.json(zakaz)
        }else {
            return next(ApiError.internal("Нет данных"));
        }
    }

    async kurZakaz (req, res, next){
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let kurr = await Kur.findOne({where: {email}})
        if (kurr){
            const zakaz = await Zakaz.findOne({where:{id: kurr.zakazId}})
            console.log('смотри тут заказ',zakaz)
        }else {
            return next(ApiError.internal("Нет данных"));
        }
    }

    async allZakaz (req, res){
        const zakaz = await Zakaz.findAll()
        return res.json(zakaz)
    }

    async mapZakaz(req, res, next){
        const {zakaz} = req.query
        console.log(req.query)
        let user = await Zakaz.findOne({ where: { id:zakaz } });
        if (!user) {
            return next(ApiError.internal("Заказ найден"));
        }
        const kurr = await Kur.findOne({where:{zakazId: zakaz}})
        const map = await User.findOne({where: {id: user.userId}})
        let result = {
            id: zakaz,
            //аватар и имя заказчика
            avatar: map.avatar,
            first_name: map.first_name,
            //аватар и имя куръера
            avatars: kurr.avatar,
            first_names: kurr.first_name,
            //Расстояние между заказом и курьером
            latitudess: kurr.latitude,
            longitudess: kurr.longitude,

            //откуда забрать
            latitudes: user.latitudes,
            longitudes: user.longitudes,
            //куда доставить
            latitude: user.latitude,
            longitude: user.longitude,
            //поиск куръера
            status1:user.status1,
            //в работе
            status2:user.status2,
            //выполнен
            status3:user.status3,
            streets: user.streets
        }
        return res.json({items: result})
    }
    // обновление координат
    async mapKurKoordinates(req, res){
        const {status2,latitude,longitude, zakaz}= req.body
        const userzakaz = await Zakaz.findOne({where:{id:zakaz}})
        switch (status2){
            case 0:
                if (userzakaz.status2 === 0){
                    return res.json(true)
                }
                break;
            case 2:
                if (userzakaz.status2 === 1){
                    let update = {latitude:latitude, longitude:longitude}
                    await Zakaz.update(update, {where:{id:userzakaz.id}})
                }
                break;
            default:
                break;
        }
    }

}
module.exports = new ZakazController();
