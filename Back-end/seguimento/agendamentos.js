const db = require("../server/db");

const agendamentos = async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT 
        agenda.ID,
        agenda.EMPRESA_ID,
        agenda.CLIENTE_NOME,
        agenda.TELEFONE,
        agenda.CPF,
        agenda.ATENDIMENTO_DESCRICAO,
        agenda.TIPO_SERVICO,
        agenda.DATA_ATENDIMENTO,
        agenda.HORA_INICIO,
        agenda.HORA_FIM,
        agenda.STATUS,
        agenda.CRIADO_EM
      FROM connect.agenda;
    `);

    res.json(results);
  } catch (error) {
    console.error("Erro ao consultar agendamentos:", error);
    res.status(500).json({ erro: "Erro ao consultar agendamentos" });
  }
};

module.exports = agendamentos;
