const express = require("express");
const router = express.Router();
const db = require("../../server/db");

router.put("/", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ erro: "ID da conta é obrigatório." });
  }

  try {
    const [resultado] = await db.query(
      "UPDATE parcelas SET STATUS = 'PAGO', DATA_PAGAMENTO = NOW() WHERE ID_CONTA = ?",
      [id]
    );

    const [contaAtualizada] = await db.query(
      "UPDATE contas SET STATUS = 'PAGA', DATA_PAGAMENTO = NOW(), ATUALIZADA_EM = NOW() WHERE ID = ?",
      [id]
    );

    if (
      parcelasAtualizadas.affectedRows === 0 &&
      contaAtualizada.affectedRows === 0
    ) {
      return res
        .status(404)
        .json({ erro: "Nenhuma parcela ou conta encontrada com esse ID." });
    }

    res.json({ mensagem: "Parcelas quitadas com sucesso." });
  } catch (error) {
    console.error("Erro ao quitar parcelas:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

module.exports = router;
