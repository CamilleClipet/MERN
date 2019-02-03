//Définition des modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors')

//On définit notre objet express nommé app
const app = express();

//Connexion à la base de donnée
mongoose.connect('mongodb://localhost/db').then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
//app.use(bodyParser.json());
app.use( bodyParser.json( { type:"*/*" } ));
//app.use(bodyParser.urlencoded({ extended: true }));

//Définition des CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, content-type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //res.header('Access-Control-Allow-Credentials', true);
    next();
});
// var corsOptions = {
//   origin: '*',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));

//Définition du routeur
var router = express.Router();
app.use('/user', router);
require(__dirname + '/controllers/userController')(router);

app.use('/message', router);
require(__dirname + '/controllers/messageController')(router);

//Définition et mise en place du port d'écoute
var port = 8000;
app.listen(port, () => console.log(`Listening on port ${port}`));
