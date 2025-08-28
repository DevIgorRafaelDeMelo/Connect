const express = require("express");
const router = express.Router();
const {
  getColaboradores,
  getDispensas,
  getDepartamento,
  getCargos,
} = require("../server/Service");

router.get("/", async (req, res) => {
  try {
    const registros = await getColaboradores();
    const dispensas = await getDispensas();
    const cargo = await getCargos();
    const departamento = await getDepartamento();

    if (registros) {
      res.json({ registros, dispensas, cargo, departamento });
    } else {
      res.status(404).json({ erro: "Cliente não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

module.exports = router;
