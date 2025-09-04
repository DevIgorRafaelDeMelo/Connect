const express = require("express");
const router = express.Router();
const { getParcelas } = require("../../server/Service");

router.put("/", async (req, res) => {
  const { id } = req.body;
  try {
    const parcelas = await getParcelas(id);

    if (parcelas) {
      res.json({ parcelas });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
