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
const Servicos = require("./seguimento/Servicos");
const ServicosId = require("./seguimento/ServicosId");
const Colaboradores = require("./seguimento/Colaboradores");
const ColaboradorId = require("./seguimento/ColaboradorId");
const AtualizaStatus = require("./seguimento/AtualizaStatus");
const Pendencias = require("./seguimento/Pendencias");
const CadastroServico = require("./seguimento/CadastroServico");
const clienteIdAgenda = require("./seguimento/ClienteIdAgenda")

app.post("/login", login);
app.post("/agenda", agenda);
app.post("/comfirmagendamento", comfirmagendamento);
app.post("/agendamentos", agendamentos);

app.use("/clientes", authMiddleware, clientes);
app.use("/clienteIdAgenda", authMiddleware, clienteIdAgenda);
app.use("/clientesList", authMiddleware, clientesList);
app.post("/Empresa", authMiddleware, Empresa);
app.use("/servicos", authMiddleware, Servicos);
app.use("/servicosId", authMiddleware, ServicosId);
app.use("/Colaboradores", authMiddleware, Colaboradores);
app.use("/ColaboradorId", authMiddleware, ColaboradorId);
app.use("/AtualizaStatus", authMiddleware, AtualizaStatus);
app.use("/Pendencias", authMiddleware, Pendencias);
app.use("/CadastroServico", authMiddleware, CadastroServico);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
