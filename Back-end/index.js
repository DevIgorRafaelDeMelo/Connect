const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const agenda = require("./seguimento/agenda");
const comfirmagendamento = require("./seguimento/comfirmagendamento");
const login = require("./seguimento/login");
const agendamentos = require("./seguimento/agendamentos");
const clientes = require("./seguimento/clientes");

app.post("/agenda", agenda);
app.post("/comfirmagendamento", comfirmagendamento);
app.post("/login", login);
app.post("/agendamentos", agendamentos);
app.use("/clientes", clientes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
