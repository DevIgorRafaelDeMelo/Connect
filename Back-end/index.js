const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const authMiddleware = require("./mid/authMiddleware");
const agenda = require("./seguimento/agenda");
const comfirmagendamento = require("./seguimento/comfirmagendamento");
const login = require("./seguimento/login");
const agendamentos = require("./seguimento/agendamentos");
const clientes = require("./seguimento/clientes");
const clientesList = require("./seguimento/clientesList");
const Empresa = require("./seguimento/empresa");

app.post("/agenda", agenda);
app.post("/comfirmagendamento", comfirmagendamento);
app.post("/login", login);
app.post("/agendamentos", agendamentos);
app.use("/clientes", clientes);
app.use("/clientesList", clientesList);
app.post("/Empresa", Empresa);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
