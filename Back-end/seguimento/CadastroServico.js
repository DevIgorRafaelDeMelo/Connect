const db = require("../server/db");

const CadastroServico = async (req, res) => {
  const { descricao, valor, horarios, ativo } = req.body;
  const horariosInt = parseInt(horarios, 10);
  const valorDecimal = Number(parseFloat(valor).toFixed(2));

  try {
    const insertQuery = `
      INSERT INTO tipos_servico (id - eempressa, NOME, VALOR, HORARIOS)
      VALUES (?, ?, ?)
    `;
    const [resultado] = await db.execute(insertQuery, [
      descricao,
      valorDecimal,
      horariosInt,
    ]);

    const selectQuery = `
      SELECT ID, NOME, VALOR, HORARIOS, ATIVO
      FROM tipos_servico
      WHERE ID = ?
    `;
    await db.execute(selectQuery, [resultado.insertId]);

    res.status(201).json({ message: "Serviço cadastrado com succeso !" });
  } catch (error) {
    res.status(500).json({ erro: "Erro interno ao cadastrar serviço." });
  }
};

module.exports = CadastroServico;
