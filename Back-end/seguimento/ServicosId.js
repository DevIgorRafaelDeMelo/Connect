const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { NOME, VALOR, HORARIOS, ATIVO } = req.body;

  const query = `
    UPDATE tipos_servico
    SET NOME = ?, VALOR = ?, HORARIOS = ?, ATIVO = ?
    WHERE ID = ?
  `;

  db.query(query, [NOME, VALOR, HORARIOS, ATIVO, id]);

  return res.json({ message: "Serviço atualizado com sucesso" });
});

module.exports = router;
