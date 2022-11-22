require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const mysql = require("mysql2");
const app = express();
app.use(express.json());


const { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env;
const pool = mysql.createPool({
    host: DB_HOST,
    database: DB_DATABASE,
    user: DB_USER,
    password: DB_PASSWORD,
    //se todas as conexões estiverem ocupadas, novos solicitantes esperam numa fila
    //se configurado com false, causa um erro quando recebe requisições e todas
    //as conexões estão ocupadas
    waitForConnections: true,
    //no máximo 10 conexões. Elas são abertas sob demanda e não no momento de
    //construção do pool
    connectionLimit: 10,
    //quantos solicitantes podem aguardar na fila? 0 significa que não há limite
    queueLimit: 0
});

//cadastro de paciente
app.post("/paciente", async (req, res) => {
    const paciente_id = Math.floor(Math.random() * 10000);
    const cpf = req.body.cpf;
    const nome = req.body.nome;
    const idade = req.body.idade;

    const sql = "INSERT INTO tb_paciente (paciente_id, cpf, nome, idade) VALUES (?, ?, ?, ?)";
    pool.query(sql, [paciente_id, cpf, nome, idade], (err, results, fields) => {
        res.json(results);
    });
    
    await axios.post("http://localhost:1000/eventos", {
        tipo: "PacienteCadastrado",
        dados: {
        paciente_id,    
        cpf,
        nome,
        idade,
        },
    });
});

app.get("/paciente", (req, res) => {
    pool.query("SELECT * FROM tb_paciente", (err, results, fields) => {
        res.json(results);
        console.log(results);
    });
});

app.get("/paciente/:id", async (req, res) => {
    var paciente_id = req.params.id;
    pool.query("SELECT * FROM tb_paciente WHERE paciente_id=" + mysql.escape(paciente_id), (err, results, fields) => {
        res.json(results);
        console.log(results);
    });
});

//cadastro de médicos
app.post("/medico", async (req, res) => {
    const medico_id = Math.floor(Math.random() * 10000);
    const crm = req.body.crm;
    const nome = req.body.nome;

    const sql = "INSERT INTO tb_medico (medico_id, crm, nome) VALUES (?, ?, ?)";
    pool.query(sql, [medico_id, crm, nome], (err, results, fields) => {
        res.json(results);
    });

    await axios.post("http://localhost:1000/eventos", {
        tipo: "MedicoCadastrado",
        dados: {
        medico_id,    
        crm,
        nome,
        },
    });
});

app.get("/medico", (req, res) => {
    pool.query("SELECT * FROM tb_medico", (err, results, fields) => {
        res.json(results);
        console.log(results);
    });
});

app.get("/medico/:id", (req, res) => {
    var medico_id = req.params.id;
    pool.query("SELECT * FROM tb_medico WHERE medico_id=" + mysql.escape(medico_id), (err, results, fields) => {
        res.json(results);
        console.log(results);
    });
});

app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

const porta = 4000;
app.listen(porta, () => console.log(`Executando. Porta ${porta}`));