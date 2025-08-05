const express = require("express");
const router = express.Router();
const authMiddleware = require("../mid/authMiddleware");
const db = require("../server/db");

router.post("/", authMiddleware, async (req, res) => {
  console.log("Token recebido:", req.headers.authorization);
  console.log("oi");
  try {
    const query = `
      SELECT ID, EMPRESA_ID, CLIENTE_NOME, TELEFONE, CPF,
             ATENDIMENTO_DESCRICAO, TIPO_SERVICO, DATA_ATENDIMENTO,
             HORA_INICIO, HORA_FIM, STATUS, CRIADO_EM
      FROM connect.agenda
    `;
    const [rows] = await db.query(query);
    console.log(rows);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    res.status(500).json({ erro: "Erro ao buscar agendamentos" });
  }
});

module.exports = router;
