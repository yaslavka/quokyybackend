require("dotenv").config();
require("dotenv").config();
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
const sequelize = require("./db");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const multer = require("multer");
const UserController = require('./src/controllers/UserControllers/index')
const KurerKontroller = require('./src/controllers/KurerKontroller/index')
const ZakazController = require('./src/controllers/ZakazController/index')
const https = require("https");
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/6551eb3.online-server.cloud/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/6551eb3.online-server.cloud/cert.pem",
  "utf8"
);
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/6551eb3.online-server.cloud/chain.pem",
  "utf8"
);


const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};
app.use(cors());
const server = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
app.use(express.json());
app.use(bodyParser.json());
app.get("/api/user/avatar", express.static(path.resolve(__dirname, "files", "images")));
app.post('/api/user/registration', UserController.registration)
app.post('/api/user/login', UserController.login)
app.get('/api/user', UserController.user)
app.post('/api/user/zakaz', ZakazController.sozdatZakazy)
app.get('/api/user/zakazy', ZakazController.myZakaz)
app.get('/api/user/myzakaz', ZakazController.mapZakaz)

//куръер
app.get("/api/kur/avatar", express.static(path.resolve(__dirname, "files", "images")));
app.get("/api/kur/document", express.static(path.resolve(__dirname, "files", "images")));
app.post('/api/kur/registration', KurerKontroller.registration)
app.post('/api/kur/login', KurerKontroller.login)
app.get('/api/kur', KurerKontroller.user)
app.get('/api/kur/locationupdate', ZakazController.mapKurKoordinates)
app.post('/api/kur/addressadd', KurerKontroller.addresadd)
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './files/images');
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage });
app.post('/api/user/avatars',upload.array('avatar'), UserController.avatar)
app.post('/api/kur/avatars',upload.array('avatar'), KurerKontroller.avatar)
app.post('/api/kur/passportrazvorot',upload.array('passportr'), KurerKontroller.passportrazvorot)
app.post('/api/kur/passportpropiska',upload.array('passportp'), KurerKontroller.passportpropiska)
app.post('/api/kur/passportselfi',upload.array('passports'), KurerKontroller.passportselfi)
const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        server.listen(80, () => console.log(`server started on port 80`));
        httpsServer.listen(443, () => console.log(`server started on port 443`));
    }catch (error){
        console.log(error);
    }
}
start();
