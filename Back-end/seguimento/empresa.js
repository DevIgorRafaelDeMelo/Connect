const db = require("../server/db");

const Empresa = async (req, res) => {
  const empresaId = req.body.ID;

  try {
    const [numero] = await db.query(
      "SELECT NUMERO FROM empresa WHERE ID = ?  ",
      [empresaId]
    );

    res.json({ NUMERO: numero });
  } catch (err) {
    console.error("Erro ao consultar a agenda:", err);
    res.status(500).json({ erro: "Erro na consulta ao banco de dados" });
  }
};

module.exports = Empresa;
