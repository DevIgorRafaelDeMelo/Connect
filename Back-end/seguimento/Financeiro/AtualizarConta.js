const express = require("express");
const router = express.Router();
const db = require("../../server/db");

router.put("/", async (req, res) => {
  const { id, VALOR, VENCIMENTO, STATUS } = req.body;

  const vencimentoFormatado = new Date(VENCIMENTO).toISOString().split("T")[0];
  if (!id) {
    return res.status(400).json({ erro: "ID da parcela é obrigatório." });
  }

  try {
    const sql = `
      UPDATE parcelas
      SET VALOR = ?, VENCIMENTO = ?, STATUS = ?
      WHERE ID = ?
    `;
    const values = [VALOR, vencimentoFormatado, STATUS, id];

    await db.query(sql, values);

    res.status(200).json({ mensagem: "Parcela atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar parcela:", error);
    res.status(500).json({ erro: "Erro interno ao atualizar parcela." });
  }
});

module.exports = router;
