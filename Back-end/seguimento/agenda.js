const db = require("../server/db");

const agenda = async (req, res) => { 
  const empresaId = req.body.ID;
  try {
    const [results] = await db.query(
      "SELECT DATA_ATENDIMENTO, HORA_INICIO, HORA_FIM FROM AGENDA WHERE EMPRESA_ID = ? ORDER BY DATA_ATENDIMENTO, HORA_INICIO",
      [empresaId]
    );

    res.json({ AGENDA: results });
  } catch (err) {
    console.error("Erro ao consultar a agenda:", err);
    res.status(500).json({ erro: "Erro na consulta ao banco de dados" });
  }
};

module.exports = agenda;
