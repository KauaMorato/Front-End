const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const request = require("request")
var people = [];

fs.readFile('InfosPeople.json', function read(err, data) {
    if (err) {
        throw err;
    }
    try {
        var peopleInfo = JSON.parse(data);
        people = peopleInfo
    } catch (e) {
        console.log("Arquivo Vazio");
    }
})

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));

app.post('/', (req, res) => {
    console.log(req);
})

app.post('/subscribe', (req, res) => {
    if (
        req.body.reCaptcha == undefined ||
        req.body.reCaptcha == '' ||
        req.body.reCaptcha == null
    ) {
        return res.json({ "success": false, 'msg': "Preencha o reCaptcha!" })
    }
    const secretKey = '6LckEfEsAAAAAIvogwvIHEJioxkBwUGkKFyu-V6G';

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.reCaptcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        if (body.success != undefined && !body.success) {
            return res.json({ "sucess": false, "msg": "Verificação Falhou!" })
        }

        return res.json({ "success": true, "msg": "Verificação Sucedida!" })
    })

    var data = req.body;

    people.push(data);

    fs.writeFile('InfosPeople.json', JSON.stringify(people, null, 2), (e) => {
        console.log(e);
    })
})

app.listen(3000, () => {
    console.log("servidor iniciado na porta 3000!");
})