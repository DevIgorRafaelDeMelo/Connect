// 📄 seguimento/ServicosId.js
const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { NOME, CARGO, ATIVO } = req.body;

  console.log(ATIVO);

  const query = `
    UPDATE funcionarios
    SET NOME = ?, CARGO = ?,  STATUS = ?
    WHERE ID = ?
  `;

  db.query(query, [NOME, CARGO, ATIVO, id]);

  return res.json({ message: "Serviço atualizado com sucesso" });
});

module.exports = router;
