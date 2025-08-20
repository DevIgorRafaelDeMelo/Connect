const db = require("../server/db");

const Empresa = async (req, res) => {
  const empresaId = Number(req.body.ID);
 
  if (!empresaId || isNaN(empresaId)) {
    return res.status(400).json({ erro: "ID inválido ou ausente." });
  }

  try {
    const [resultado] = await db.query(
      "SELECT NUMERO FROM empresa WHERE ID = ?",
      [empresaId]
    );

    if (resultado.length === 0) {
      return res.status(404).json({ erro: "Empresa não encontrada." });
    }

    res.json({ NUMERO: resultado[0].NUMERO });
  } catch (err) {
    console.error("Erro ao consultar a empresa:", err);
    res.status(500).json({ erro: "Erro na consulta ao banco de dados." });
  }
};

module.exports = Empresa;
