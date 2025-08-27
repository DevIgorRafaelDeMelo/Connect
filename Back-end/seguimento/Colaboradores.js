const express = require("express");
const router = express.Router();
const { getColaboradores, getDispensas  } = require("../server/Service");

router.get("/", async (req, res) => {
  try {
    const registros = await getColaboradores();
    const dispensas = await getDispensas()
    if (registros) {
      res.json({ registros, dispensas });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
