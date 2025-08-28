const jwt = require("jsonwebtoken");
const db = require("../server/db");

const SEGREDO = process.env.JWT_SECRET || "sua_chave_secreta";

const login = async (req, res) => {
  console.log("oi")
  const { email, senha } = req.body;

  try {
    const query = `
      SELECT 
        empresa.ID,
        empresa.NOME_EMPRESA,
        empresa.CNPJ,
        empresa.CRIADO_EM
      FROM connect.empresa
      WHERE empresa.LOGIN = ? AND empresa.SENHA = ?
    `;
    const values = [email, senha];

    const [rows] = await db.query(query, values);

    if (rows.length > 0) {
      const empresa = rows[0];

      const token = jwt.sign(
        {
          id: empresa.ID,
          nome: empresa.NOME_EMPRESA,
          cnpj: empresa.CNPJ,
        },
        SEGREDO,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        sucesso: true,
        empresa,
        token,
      });
    } else {
      res
        .status(401)
        .json({ sucesso: false, mensagem: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res
      .status(500)
      .json({ sucesso: false, mensagem: "Erro interno do servidor" });
  }
};

module.exports = login;
