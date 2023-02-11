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
app.use("/api/user/avatar", express.static(path.resolve(__dirname, "files", "images")));
app.post('/api/user/registration', UserController.registration)
app.post('/api/user/login', UserController.login)
//app.post('/api/user/location', UserController.location)
app.get('/api/user', UserController.user)
app.post('/api/user/zakaz', ZakazController.sozdatZakazy)
app.use('/api/user/zakazy', ZakazController.myZakaz)
app.use('/api/user/myzakaz', ZakazController.mapZakaz)
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
