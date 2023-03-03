const ApiError = require("../../error/ApiError");
const bcrypt = require("bcrypt");
const {User} = require('../../Models/UserModels/index')
const jwt = require("jsonwebtoken");
const decode='random_key'
const generateJwt = (id, email, first_name, last_name, phone) => {
    return jwt.sign({id:id, email: email, first_name: first_name, last_name: last_name, phone:phone },decode);
};
class UserController {
    async registration(req, res, next){
        console.log(req.body)
        const {email, first_name, last_name, password, phone,  longitude, latitude,} = req.body;
        if (!email || !password || !last_name || !first_name || !phone) {
            return next(ApiError.badRequest("Не все поля заполнены"));
        }
        const candidateEmail = await User.findOne({ where: { email } })
        const candidatephone = await User.findOne({ where: { phone } })
        if (candidateEmail) {
            return next(ApiError.badRequest("Такой email уже существует"));
        }
        if (candidatephone){
            return next(ApiError.badRequest("Такой телефон уже существует"));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const users = await User.create({
            first_name,
            last_name,
            phone,
            email,
            longitude: longitude,
            latitude: latitude,
            password: hashPassword,
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
        const user = await User.findOne({ where: { email } });
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
            let user = await User.findOne({ where: { email } });
            if (!user) {
                return next(ApiError.internal("Такой пользователь не найден"));
            }
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
        const user = await User.findOne({
            where: { email: decodeToken.email },
        });
        let fileName = req.files[0].filename;
        let update = { avatar: fileName };
        await User.update(update, { where: { id: user.id } });
        return res.json("Аватар успешно загружен");
    }
    async cengeinfo(req, res, next){
        const { first_name, last_name, phone, email, password, new_password,} = req.body
        const { authorization } = req.headers;
        if(!authorization){
            return res.json('Ненайден айди пользователя');
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await User.findOne({
            where: { email: decodeToken.email },
        });
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal("Неверный пароль"));
        }
        const hashPassword = await bcrypt.hash(new_password, 5);
        let update = {first_name:first_name, last_name:last_name, phone:phone, email: email, password:hashPassword}
        await User.update(update, {where:{id:user.id}})
        return res.json(true)

    }
    async dellete(req, res) {
        const { authorization } = req.headers;
        if(!authorization){
            return res.json('Ненайден айди пользователя');
        }
        const token = authorization.slice(7);
        const decodeToken = jwt.decode(token);
        const user = await User.findOne({
            where: { email: decodeToken.email },
        });
        await User.destroy({where: {id: user.id}})
        return res.json(true)

    }

}
module.exports = new UserController();
