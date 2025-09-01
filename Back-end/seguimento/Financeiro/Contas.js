const express = require("express");
const router = express.Router();
const { getContas, getClients } = require("../../server/Service");

router.get("/", async (req, res) => {
  try {
    const contas = await getContas();
    const Cadastros = await getClients();

    if (contas) {
      res.json({ contas, Cadastros });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
