const db = require("../server/db");

const CadastroServico = async (req, res) => {
  const { descricao, valor, horarios, ativo } = req.body;

  if (!descricao || !valor || !horarios || ativo === undefined) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  try {
    const insertQuery = `
      INSERT INTO tipos_servico (NOME, VALOR, HORARIOS, ATIVO)
      VALUES (?, ?, ?, ?)
    `;
    const [resultado] = await db.execute(insertQuery, [
      descricao,
      valor,
      horarios,
      ativo,
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
