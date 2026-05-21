const express = require('express');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da raiz (onde está o index.html)
app.use(express.static(__dirname));

let people = [];

// Carregar dados do JSON
fs.readFile('InfosPeople.json', 'utf8', (err, data) => {
    if (err) {
        console.log("Arquivo não encontrado ou vazio, iniciando vazio.");
        people = [];
        return;
    }
    try {
        people = JSON.parse(data);
    } catch (e) {
        console.log("Erro ao parsear JSON, iniciando vazio.");
        people = [];
    }
});

app.post('/subscribe', (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];

    if (!recaptchaResponse) {
        return res.json({ success: false, msg: "Preencha o reCAPTCHA!" });
    }

    const secretKey = '6LckEfEsAAAAAIvogwvIHEJioxkBwUGkKFyu-V6G';
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}&remoteip=${req.ip}`;

    // Usando fetch nativo (Node 18+)
    fetch(verifyUrl)
        .then(res => res.json())
        .then(body => {
            if (!body.success) {
                return res.json({ success: false, msg: "Verificação do reCAPTCHA falhou!" });
            }

            // Se chegou aqui, reCAPTCHA está OK
            const data = req.body;
            people.push(data);

            fs.writeFile('InfosPeople.json', JSON.stringify(people, null, 2), (err) => {
                if (err) console.error("Erro ao salvar JSON:", err);
            });

            res.json({ success: true, msg: "Inscrição realizada com sucesso!" });
        })
        .catch(err => {
            console.error(err);
            res.json({ success: false, msg: "Erro interno no servidor" });
        });
});

app.listen(3000, () => {
    console.log("🚀 Servidor rodando na porta 3000!");
});