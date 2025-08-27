const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { NOME, CARGO, ATIVO, EXPEDIENTE } = req.body;

  try {
    const queryFuncionario = `
      UPDATE FUNCIONARIOS
      SET NOME = ?, CARGO = ?, STATUS = ?
      WHERE ID = ?
    `;
    await db.execute(queryFuncionario, [NOME, CARGO, ATIVO, id]);

    const dias = Object.entries(EXPEDIENTE).filter(([_, dados]) => dados.ativo);

    for (const [dia, dados] of dias) {
      const { ativo, inicio, pausaInicio, pausaFim, fim } = dados;

      const checkQuery = `
        SELECT ID FROM EXPEDIENTE_FUNCIONARIOS
        WHERE FUNCIONARIO_ID = ? AND DIA_SEMANA = ?
      `;
      const [results] = await db.execute(checkQuery, [id, dia]);

      if (results.length > 0) {
        const updateQuery = `
          UPDATE EXPEDIENTE_FUNCIONARIOS
          SET ATIVO = ?, INICIO = ?, PAUSA_INICIO = ?, PAUSA_FIM = ?, FIM = ?
          WHERE FUNCIONARIO_ID = ? AND DIA_SEMANA = ?
        `;
        await db.execute(updateQuery, [
          ativo,
          inicio || null,
          pausaInicio || null,
          pausaFim || null,
          fim || null,
          id,
          dia,
        ]);
      } else {
        const insertQuery = `
          INSERT INTO EXPEDIENTE_FUNCIONARIOS
          (FUNCIONARIO_ID, DIA_SEMANA, ATIVO, INICIO, PAUSA_INICIO, PAUSA_FIM, FIM)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await db.execute(insertQuery, [
          id,
          dia,
          ativo,
          inicio || null,
          pausaInicio || null,
          pausaFim || null,
          fim || null,
        ]);
      }
    }

    res.json({ message: "Serviço atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar funcionário ou expediente:", error);
    res.status(500).json({ error: "Erro interno ao salvar expediente" });
  }
});

module.exports = router;
