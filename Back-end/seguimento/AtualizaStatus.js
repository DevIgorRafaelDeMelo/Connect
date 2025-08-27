const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const { ATIVO } = req.body;
  
  const query = `
    UPDATE agenda
    SET STATUS = ?
    WHERE ID = ?
  `;

  db.query(query, [ATIVO, id], (err, result) => {
    if (err) {
      console.error("Erro no banco:", err);
      return res.status(500).json({ error: "Erro ao atualizar serviço" });
    }
  });
  return res.json({ message: `Serviço atualizado com sucesso !  ${ATIVO}` });
});

module.exports = router;
