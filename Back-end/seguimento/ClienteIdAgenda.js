const express = require("express");
const router = express.Router();
const { getClientByID, getClientsByCPF } = require("../server/Service");

router.get("/:id/:idA", async (req, res) => {
  const { id, idA } = req.params; 
  try {
    const atendimento = await getClientByID(idA);
    const registros = await getClientsByCPF(id);

    if (atendimento) {
      res.json({
        atendimento,
        registros,
      });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
