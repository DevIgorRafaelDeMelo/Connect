const db = require("../server/db");

const Empresa = async (req, res) => {

    
  res.status(200).json({ mensagem: "Empresa recebida com sucesso." });
};

module.exports = Empresa;
