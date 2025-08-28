const express = require("express");
const router = express.Router();
const db = require("../server/db");

const Cadastrocolaboradore = async (req, res) => {
  const {
    NOME,
    CPF,
    TELEFONE,
    EMAIL,
    CARGO_ID,
    DEPARTAMENTO_ID,
    DATA_INICIO,
    OBSERVACOES,
    EXPEDIENTE,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO FUNCIONARIOS 
      (NOME, CPF, TELEFONE, EMAIL, CARGO_ID, DEPARTAMENTO_ID, DATA_INICIO, OBSERVACOES) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        NOME,
        CPF,
        TELEFONE,
        EMAIL,
        CARGO_ID,
        DEPARTAMENTO_ID,
        DATA_INICIO,
        OBSERVACOES,
      ]
    );
    const colaboradorId = result.insertId;

    for (const [dia, dados] of Object.entries(EXPEDIENTE)) {
      const { ativo, inicio, pausaInicio, pausaFim, fim } = dados;

      const checkQuery = `
       SELECT ID FROM EXPEDIENTE_FUNCIONARIOS
       WHERE FUNCIONARIO_ID = ? AND DIA_SEMANA = ?
     `;
      const [results] = await db.execute(checkQuery, [colaboradorId, dia]);

      if (results.length > 0) {
        const updateQuery = `
         UPDATE EXPEDIENTE_FUNCIONARIOS
         SET ATIVO = ?, INICIO = ?, PAUSA_INICIO = ?, PAUSA_FIM = ?, FIM = ?
         WHERE FUNCIONARIO_ID = ? AND DIA_SEMANA = ?
       `;
        await db.execute(updateQuery, [
          ativo,
          inicio || null,
          pausaInicio || null,
          pausaFim || null,
          fim || null,
          colaboradorId,
          dia,
        ]);
      } else {
        const insertQuery = `
         INSERT INTO EXPEDIENTE_FUNCIONARIOS
         (FUNCIONARIO_ID, DIA_SEMANA, ATIVO, INICIO, PAUSA_INICIO, PAUSA_FIM, FIM)
         VALUES (?, ?, ?, ?, ?, ?, ?)
       `;
        await db.execute(insertQuery, [
          colaboradorId,
          dia,
          ativo,
          inicio || null,
          pausaInicio || null,
          pausaFim || null,
          fim || null,
        ]);
      }
    }
    res.status(201).json({ message: "Colaborador cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar colaborador:", error);
    res.status(500).json({ message: "Erro ao cadastrar colaborador" });
  }
};

module.exports = Cadastrocolaboradore;
