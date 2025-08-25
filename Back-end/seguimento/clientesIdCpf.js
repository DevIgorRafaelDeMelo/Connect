const express = require("express");
const router = express.Router();
const { getClientsAgenda, getClientsByCPF } = require("../server/Service");

router.get("/:id/:cpf", async (req, res) => {
  const { id, cpf } = req.params;

  try {
    const atendimento = await getClientsAgenda(cpf);
    const registros = await getClientsByCPF(id);
    if (atendimento) {
      res.json({ atendimento, registros });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
