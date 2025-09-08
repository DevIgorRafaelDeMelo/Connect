const express = require("express");
const router = express.Router();
const { getContas, getClients, getParcelas } = require("../../server/Service");

router.get("/", async (req, res) => {
  try {
    const contas = await getContas();
    const Cadastros = await getClients();
    const Prestacoes = await getParcelas();

    if (contas) {
      res.json({ contas, Cadastros, Prestacoes });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
