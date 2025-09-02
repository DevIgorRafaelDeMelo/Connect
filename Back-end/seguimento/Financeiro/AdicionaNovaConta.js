const express = require("express");
const router = express.Router();
const db = require("../../server/db");

router.put("/", async (req, res) => {
  try {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const {
      DESCRICAO,
      CLIENTE_NOME,
      VALOR_TOTAL,
      VALOR_PAGO,
      MULTA,
      JUROS,
      DESCONTO,
      NUMERO_PARCELAS,
      VENCIMENTO,
      TIPO,
      ID_DEVEDOR,
    } = req.body;

    const multaDecimal = parseFloat(MULTA || 0).toFixed(2);
    const jurosDecimal = parseFloat(JUROS || 0).toFixed(2);
    const descontoDecimal = parseFloat(DESCONTO || 0).toFixed(2);
    const valorTotal = parseFloat(VALOR_TOTAL);
    const parcelas = parseInt(NUMERO_PARCELAS);

    if (
      !CLIENTE_NOME ||
      !VALOR_TOTAL ||
      !NUMERO_PARCELAS ||
      !VENCIMENTO ||
      !ID_DEVEDOR
    ) {
      return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
    }

    const query = `
  INSERT INTO contas (
    TIPO, NOME,  
    VALOR_TOTAL, VALOR_PAGO, MULTA, JUROS,
    DESCONTO, NUMERO_PARCELAS, VENCIMENTO, ID_DEVEDOR,
    CRIADA_EM, ATUALIZADA_EM, STATUS
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    const values = [
      TIPO || "",
      DESCRICAO || "",
      valorTotal,
      VALOR_PAGO || 0,
      multaDecimal || 0,
      jurosDecimal || 0,
      descontoDecimal || 0,
      parcelas,
      VENCIMENTO,
      ID_DEVEDOR,
      now,
      now,
      "PENDENTE",
    ];

    const [result] = await db.execute(query, values);

    res.status(201).json({ mensagem: "Conta adicionada com sucesso." });
  } catch (error) {
    console.error("Erro ao adicionar conta:", error);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

module.exports = router;
