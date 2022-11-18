require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
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


app.post("/medico", (req, res) => {
});

app.get("/medico", (req, res) => {
});

app.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

const porta = 5000;
app.listen(porta, () => console.log(`Executando. Porta ${porta}`));