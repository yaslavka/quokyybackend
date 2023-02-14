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
    //заказ на исполнении
    async kurZakaz (req, res, next){
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let kurr = await Kur.findOne({where: {email}})
        if (kurr){
            const zakaz = await Zakaz.findOne({where:{id: kurr.orderId}})
            return res.json({
                items: {
                    id:zakaz.id,
                    //Куда доставить
                    latitude:zakaz.latitude,
                    longitude:zakaz.longitude,
                    address:zakaz.address,
                    street:zakaz.street,
                    //откуда забрать
                    latitudes:zakaz.latitudes,
                    longitudes:zakaz.longitudes,
                    addresss:zakaz.addresss,
                    streets:zakaz.streets,
                    ves:zakaz.ves,
                    namesgruz:zakaz.namesgruz,
                    typedostav:zakaz.typedostav,
                    nameuser:zakaz.nameuser,
                    poruchenie:zakaz.poruchenie,
                    datetime:zakaz.datetime,
                    phone:zakaz.phone,
                    strahovka:zakaz.strahovka,
                    cennost:zakaz.cennost,
                    summ:zakaz.summ,
                    status1:zakaz.status1,
                    status2:zakaz.status2,
                    status3:zakaz.status3

                }})
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
    async mapKurZakaz(req, res, next){
        const {zakaz} = req.query
        let zakazkur = await Zakaz.findOne({ where: { id:zakaz } });
        if (!zakazkur) {
            return next(ApiError.internal("Заказ найден"));
        }
        const kurr = await Kur.findOne({where:{orderId: zakazkur.id}})
        const map = await User.findOne({where: {id: zakazkur.userId}})
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
            latitudes: zakazkur.latitudes,
            longitudes: zakazkur.longitudes,
            //куда доставить
            latitude: zakazkur.latitude,
            longitude: zakazkur.longitude,
            status2:zakazkur.status2
        }
        return res.json({items: result})
    }
    // обновление координат
    async mapKurKoordinates(req, res){
        const {status2,latitude,longitude, zakaz}= req.body
        console.log(req.body)
        const userzakaz = await Zakaz.findOne({where:{id:zakaz}})
        switch (status2){
            case false:
                if (userzakaz.status2 === false){
                    return res.json(true)
                }
                break;
            case true:
                if (userzakaz.status2 === true){
                    let update = {latitude:latitude, longitude:longitude}
                    await Kur.update(update, {where:{orderId:userzakaz.id}})
                }
                break;
            default:
                break;
        }
    }

}
module.exports = new ZakazController();
