const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { NOME, CARGO, ATIVO, EXPEDIENTE } = req.body;

  const queryFuncionario = `
    UPDATE FUNCIONARIOS
    SET NOME = ?, CARGO = ?, STATUS = ?
    WHERE ID = ?
  `;
  db.query(queryFuncionario, [NOME, CARGO, ATIVO, id], (err) => {
    
    
  });
});

module.exports = router;
