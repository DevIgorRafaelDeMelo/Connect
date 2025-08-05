const db = require("../server/db");

const comfirmagendamento = async (req, res) => {
  try {
    const { nome, telefone, cpf, tipoServico, horario, data } = req.body;

    const empresaId = req.body.ID;
    const atendimentoDescricao = "Agendamento via sistema";
    const horaFim = calcularHoraFim(horario);
    const status = "AGENDADO";

    const query = `
        INSERT INTO connect.agenda (
            CLIENTE_NOME,
            TELEFONE,
            CPF,
            TIPO_SERVICO,
            DATA_ATENDIMENTO,
            HORA_INICIO,
            EMPRESA_ID,
            ATENDIMENTO_DESCRICAO,
            HORA_FIM,
            STATUS,
            CRIADO_EM
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const criadoEm = new Date();

    const values = [
      nome,
      telefone,
      cpf,
      tipoServico,
      data,
      horario,
      empresaId,
      atendimentoDescricao,
      horaFim,
      status,
      criadoEm,
    ];

    await db.execute(query, values);

    res.status(201).json({ message: "Agendamento confirmado com sucesso!" });
  } catch (error) {
    console.error("Erro ao inserir no banco:", error);
    res.status(500).json({ error: "Erro ao registrar o agendamento." });
  }
};

function calcularHoraFim(horaInicio) {
  const [hora, minuto] = horaInicio.split(":").map(Number);
  const date = new Date();
  date.setHours(hora);
  date.setMinutes(minuto + 30);
  return date.toTimeString().split(" ")[0].slice(0, 8);
}

module.exports = comfirmagendamento;
