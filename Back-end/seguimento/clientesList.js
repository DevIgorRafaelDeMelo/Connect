const express = require("express");
const router = express.Router();
const { getClients } = require("../server/Service");

router.get("/", async (req, res) => {
  try {
    const registros = await getClients();
    if (registros) {
      res.json({ registros });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
