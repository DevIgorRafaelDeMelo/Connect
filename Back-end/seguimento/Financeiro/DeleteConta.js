const express = require("express");
const router = express.Router();
const { getParcelas } = require("../../server/Service");

router.delete("/", async (req, res) => {
  const { id } = req.body;
  console.log(id);
  if (!id) {
    return res.status(400).json({ erro: "ID da conta é obrigatório." });
  }

  try {
    const [resultado] = await db.query("DELETE FROM contas WHERE ID = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    res.json({ mensagem: "Conta excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

module.exports = router;
