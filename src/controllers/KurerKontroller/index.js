const ApiError = require("../../error/ApiError");
const bcrypt = require("bcrypt");
const {Kur} = require('../../Models/KurModel/index')
const jwt = require("jsonwebtoken");
const {KurerDocuments} = require("../../Models/KererDockumentsModels");
const decode='random_key'
const generateJwt = (id, email, first_name, last_name, phone) => {
    return jwt.sign({id:id, email: email, first_name: first_name, last_name: last_name, phone:phone },decode);
};

class KurerKontroller {
    async registration(req, res, next){
        const {email, first_name, last_name, password, phone,  longitude, latitude,} = req.body;
        if (!email || !password || !last_name || !first_name || !phone) {
            return next(ApiError.badRequest("Не все поля заполнены"));
        }
        const candidateEmail = await Kur.findOne({ where: { email } })
        const candidatephone = await Kur.findOne({ where: { phone } })
        if (candidateEmail) {
            return next(ApiError.badRequest("Такой email уже существует"));
        }
        if (candidatephone){
            return next(ApiError.badRequest("Такой телефон уже существует"));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const users = await Kur.create({
            first_name,
            last_name,
            phone,
            email,
            longitude: longitude,
            latitude: latitude,
            password: hashPassword,
            typedostav: 5
        });
        const access_token = generateJwt(
            users.id,
            users.email,
            users.first_name,
            users.last_name,
        );
        return res.json({ access_token });

    }
    async login(req, res, next){
        const { email, password } = req.body;
        const user = await Kur.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.internal("Не верный Email"));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal("Неверный пароль"));
        }
        const access_token = generateJwt(
            user.id,
            user.email,
            user.first_name,
            user.last_name,
            user.phone
        );
        return res.json({ access_token });
    }
    async user(req, res, next){
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Вы не авторизованы'});
        }
        const token = authorization.slice(7);
        try {
            const { email } = jwt.decode(token);
            let user = await Kur.findOne({ where: { email } });
            let document = await KurerDocuments.findOne({where:{kurId: user.id}})
            if (!user) {
                return next(ApiError.internal("Такой пользователь не найден"));
            }

            user.dataValues.documents = document
            return res.json(user);
        }catch (error) {
            return next(ApiError.internal(error));
        }

    }

    async avatar(req, res) {
        const { authorization } = req.headers;
        if(!authorization){
            return res.json('Ненайден айди пользователя');
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        let fileName = req.files[0].filename;
        let update = { avatar: fileName };
        await Kur.update(update, { where: { id: user.id } });
        return res.json("Аватар успешно загружен");
    }
    async passportrazvorot(req, res) {
        console.log(req.files)
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Ненайден айди пользователя'});
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        let fileName = req.files[0].filename;
        let checkCurer = await KurerDocuments.findOne({where:{kurId: user.id}})
        if (!checkCurer){
            await KurerDocuments.create({
                passportRszvorot: fileName,
                kurId: user.id,
                kererId: user.id
            })
        } else {
            let update = { passportRszvorot: fileName };
            await KurerDocuments.update(update, { where: { kurId: user.id } });
        }
        return res.json({message: "Аватар успешно загружен"});
    }
    async passportpropiska(req, res) {
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Ненайден айди пользователя'});
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        let fileName = req.files[0].filename;
        let checkCurer = await KurerDocuments.findOne({where:{kurId: user.id}})
        if (!checkCurer){
            await KurerDocuments.create({
                passportPropiska: fileName,
                kurId: user.id,
                kererId: user.id
            })
        } else {
            let update = { passportPropiska: fileName };
            await KurerDocuments.update(update, { where: { kurId: user.id } });
        }
        return res.json({message: "Аватар успешно загружен"});
    }
    async passportselfi(req, res) {
        const { authorization } = req.headers;
        if(!authorization){
            return res.json({message: 'Ненайден айди пользователя'});
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        let fileName = req.files[0].filename;
        let checkCurer = await KurerDocuments.findOne({where:{kurId: user.id}})
        if (!checkCurer){
            await KurerDocuments.create({
                passportSelfi: fileName,
                kurId: user.id,
                kererId: user.id
            })
        } else {
            let update = { passportSelfi: fileName };
            await KurerDocuments.update(update, { where: { kurId: user.id } });
        }
        return res.json({message: "Аватар успешно загружен"});
    }
    async addresadd(req, res) {
        const { authorization } = req.headers;
        const {address} = req.body
        if(!authorization){
            return res.json({message: 'Ненайден айди пользователя'});
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        let checkCurer = await KurerDocuments.findOne({where:{kurId: user.id}})
        if (!checkCurer){
            await KurerDocuments.create({
                address: address,
                kurId: user.id,
                kererId: user.id
            })
        } else {
            let update = { address: address };
            await KurerDocuments.update(update, { where: { kurId: user.id } });
        }
        return res.json({message: "Данные успешно обновленны"});
    }
    async cengeinfo(req, res, next){
        const { first_name, last_name, phone, emails, password} = req.body
        const { authorization } = req.headers;
        if(!authorization){
            return res.json('Ненайден айди пользователя');
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        //let comparePassword = bcrypt.compareSync(password, user.password);
        const hashPassword = await bcrypt.hash(password, 5);
        const firstname = first_name
        const lastname = last_name
        const phones =phone
        const email = emails
        const passwor = password
        if (!firstname){
            await Kur.update({first_name:user.first_name}, {where:{first_name:user.first_name}})
        }else {
            await Kur.update({first_name:first_name}, {where:{first_name:user.first_name}})

        }
        if (!lastname) {
            await Kur.update({last_name:user.last_name}, {where:{last_name:user.last_name}})
        }else {
            await Kur.update({last_name:last_name}, {where:{last_name:user.last_name}})
        }
        if (!phones){
            await Kur.update({phone:user.phone}, {where:{phone:user.phone}})
        }else {
            await Kur.update({phone:phone}, {where:{phone:user.phone}})
        }
        if (!email){
            await Kur.update({email:user.email}, {where:{email:user.email}})
        }else {
            await Kur.update({email:emails}, {where:{email:user.email}})
        }
        // if (!comparePassword) {
        //     return next(ApiError.internal("Неверный пароль"));
        // }
        if (!passwor){
            return res.json(true)
        }else {
            await Kur.update({password:hashPassword}, {where:{password:user.password}})
        }

    }
    async dellete(req, res) {
        const { authorization } = req.headers;
        if(!authorization){
            return res.json('Ненайден айди пользователя');
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await Kur.findOne({
            where: { email: decodeToken.email },
        });
        await Kur.destroy({where: {id: user.id}})
        return res.json(true)

    }
}
module.exports = new KurerKontroller();
