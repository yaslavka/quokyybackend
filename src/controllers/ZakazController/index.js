const ApiError = require("../../error/ApiError");
const {User} = require('../../Models/UserModels/index')
const {Zakaz} = require('../../Models/ZakazModels/index')
const jwt = require("jsonwebtoken");
const {Kurrerhystory} = require("../../Models/kurrerhystory");
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

    async kurHystory (req, res, next){
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let user = await Kur.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal("Такой пользователь не найден"));
        }
        if (user){
            const zakaz = await Kurrerhystory.findAll({where: {kererId: user.id}})
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
            if (!zakaz){
                return res.json({message: 'Вы не авторизованы'});
            }
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
                    status3:zakaz.status3,
                    status4:zakaz.status4,
                    status5:zakaz.status5

                }})
        }else {
            return next(ApiError.internal("Нет данных"));
        }
    }

    async allZakaz (req, res){
        const zakaz = await Zakaz.findAll({order: [['createdAt', 'DESC']]})
        return res.json(zakaz)
    }
    async search (req, res){
        console.log(req.body)
        const zakaz = await Zakaz.findAll()
        let z ={}
        z.dataValues = zakaz
        return res.json(z)
    }
    async vZakaz (req, res){
        const {zakaz} = req.query
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        let user = await Zakaz.findOne({ where: { id:zakaz } });
        if (!user) {
            return res.json({message: "заказ не найден"});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let kurr = await Kur.findOne({where: {email}})
        if (user.status1 === false){
            let update = {orderId:user.id}
            let statusypdate = {status1: true}
            await Kur.update(update, {where:{id: kurr.id}})
            await Zakaz.update(statusypdate,{where: {id: user.id}})
            return res.json({message: "заказ успешно взят в работу"})
        }else if (user.status1 === true){
            return res.json({message: "заказ был взят в работу джругим куръером"})
        }
    }

    async mapZakaz(req, res, next){
        const {zakaz} = req.query
        let user = await Zakaz.findOne({ where: { id:zakaz } });
        if (!user) {
            return next(ApiError.internal("Заказ найден"));
        }
        const kurr = await Kur.findOne({where:{orderId: zakaz}})
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
            streets: user.streets,
            latitudes: user.latitudes,
            longitudes: user.longitudes,
            //куда доставить
            street: user.street,
            latitude: user.latitude,
            longitude: user.longitude,
            //поиск куръера
            status1:user.status1,
            //в работе
            status2:user.status2,
            //выполнен
            status3:user.status3,
            status4:user.status4,
            status5:user.status5,
            datetime: user.datetime
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
            status1:zakazkur.status1,
            status2:zakazkur.status2,
            status3:zakazkur.status3,
            status4:zakazkur.status4,
            status5:zakazkur.status5
        }
        return res.json({items: result})
    }
    // обновление координат
    async mapKurKoordinates(req, res){
        const {status2,latitude,longitude, zakaz}= req.body
        console.log(req.body)
       await setTimeout(async ()=>{
           const userzakaz = await Zakaz.findOne({where:{id:zakaz}})
            switch (status2){
                case 0:
                    if (userzakaz.status2 === false){
                        return res.json(true)
                    }
                    break;
                case 1:
                    if (userzakaz.status2 === true){
                        let update = {latitude:latitude, longitude:longitude}
                        await Kur.update(update, {where:{orderId:userzakaz.id}})
                    }
                    break;
                default:
                    break;
            }
        },3000)
    }
    async getStatus(req, res){
        const {id, status} = req.body
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let kurr = await Kur.findOne({where: {email}})
        const zkazstatus = Zakaz.findOne({where:{id:id}})
        if (status === 2){
            let update = {status2:true}
            await Zakaz.update(update, {where:{id:zkazstatus.id}})
        }
        if (status === 3){
            let update = {status3:true}
            await Zakaz.update(update, {where:{id:zkazstatus.id}})
        }
        if (status === 4){
            let update = {status4:true}
            await Zakaz.update(update, {where:{id:zkazstatus.id}})
        }
        if (status === 5){
            let update = {status5:true}
            let up = {orderId: null}
            await Zakaz.update(update, {where:{id:zkazstatus.id}})
            await Kur.update(up, {where:{orderId: kurr.orderId}})
            await Kurrerhystory.create({
                //Куда доставить
                latitude:zkazstatus.latitude,
                longitude:zkazstatus.longitude,
                address:zkazstatus.address,
                street:zkazstatus.street,
                //откуда забрать
                latitudes:zkazstatus.latitudes,
                longitudes:zkazstatus.longitudes,
                addresss:zkazstatus.addresss,
                streets:zkazstatus.streets,
                ves:zkazstatus.ves,
                namesgruz:zkazstatus.namesgruz,
                typedostav:zkazstatus.typedostav,
                nameuser:zkazstatus.nameuser,
                poruchenie:zkazstatus.poruchenie,
                datetime:zkazstatus.datetime,
                phone:zkazstatus.phone,
                strahovka:zkazstatus.strahovka,
                cennost:zkazstatus.cennost,
                summ:zkazstatus.summ,
                status1:zkazstatus.status1,
                status2:zkazstatus.status2,
                status3:zkazstatus.status3,
                status4:zkazstatus.status4,
                status5:zkazstatus.status5,
                kererId:kurr.id
            })
        }
        return res.json(true)
    }
    async getTyped(req, res){
        const {type} =req.body
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        const { email } = jwt.decode(token);
        let kurr = await Kur.findOne({where: {email}})
        let update = {typedostav:type}
        await Kur.update(update, {where: {id:kurr.id }})
        return res.json(true)
    }

}
module.exports = new ZakazController();
