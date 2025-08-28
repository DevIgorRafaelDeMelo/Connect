const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { DATA_INICIO, DATA_FIM, DESCRICAO } = req.body;

  try {
    if (DATA_INICIO && DATA_FIM) {
      await db.query(
        "INSERT INTO DISPENSAS (FUNCIONARIO_ID, DATA_INICIO, DATA_FIM, DESCRICAO) VALUES (?, ?, ?, ?)",
        [id, DATA_INICIO, DATA_FIM, DESCRICAO || null]
      );
    }


    res.json({ message: "Dados atualizados com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar colaborador:", error);
    res.status(500).json({ message: "Erro interno ao atualizar colaborador." });
  }
});

module.exports = router;
