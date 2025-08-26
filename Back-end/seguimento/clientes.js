const express = require("express");
const router = express.Router();
const { getClientsByCPF, getClientByIdUser } = require("../server/Service");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const registros = await getClientsByCPF(id);
    const cliente = await getClientByIdUser(id);
    console.log(cliente, registros);
    if (registros) {
      res.json({
        registros,
        cliente,
      });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
