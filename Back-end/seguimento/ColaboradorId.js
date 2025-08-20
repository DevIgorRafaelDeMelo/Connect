const express = require("express");
const router = express.Router();
const db = require("../server/db");

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { NOME, CARGO, ATIVO, EXPEDIENTE } = req.body;

  const queryFuncionario = `
    UPDATE FUNCIONARIOS
    SET NOME = ?, CARGO = ?, STATUS = ?
    WHERE ID = ?
  `;

  db.query(queryFuncionario, [NOME, CARGO, ATIVO, id]);

  const dias = Object.entries(EXPEDIENTE).filter(([_, dados]) => dados.ativo);

  const promessas = dias.map(([dia, dados]) => {
    const { ativo, inicio, pausaInicio, pausaFim, fim } = dados;

    return new Promise((resolve, reject) => {
      const checkQuery = `
        SELECT ID FROM EXPEDIENTE_FUNCIONARIOS
        WHERE FUNCIONARIO_ID = ? AND DIA_SEMANA = ?
      `;

      db.query(checkQuery, [id, dia], (err, results) => {
        if (err) {
          console.error(`Erro ao verificar expediente de ${dia}:`, err);
          return reject(err);
        }
        console.log(results)
        if (results.length > 0) { 
          console.log()
          const updateQuery = `
            UPDATE EXPEDIENTE_FUNCIONARIOS
            SET ATIVO = ?, INICIO = ?, PAUSA_INICIO = ?, PAUSA_FIM = ?, FIM = ?
            WHERE FUNCIONARIO_ID = ? AND DIA_SEMANA = ?
          `;
          db.query(
            updateQuery,
            [
              ativo,
              inicio || null,
              pausaInicio || null,
              pausaFim || null,
              fim || null,
              id,
              dia,
            ],
            (err) => {
              if (err) {
                console.error(`Erro ao atualizar expediente de ${dia}:`, err);
                return reject(err);
              }
              resolve();
            }
          );
        } else {  
          const insertQuery = `
            INSERT INTO EXPEDIENTE_FUNCIONARIOS 
            (FUNCIONARIO_ID, DIA_SEMANA, ATIVO, INICIO, PAUSA_INICIO, PAUSA_FIM, FIM)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          db.query(
            insertQuery,
            [
              id,
              dia,
              ativo,
              inicio || null,
              pausaInicio || null,
              pausaFim || null,
              fim || null,
            ],
            (err) => {
              if (err) {
                console.error(`Erro ao inserir expediente de ${dia}:`, err);
                return reject(err);
              }
              resolve();
            }
          );
        }
      });
    });
  });

  Promise.all(promessas)
    .then(() => {
      return res.json({ message: "Serviço atualizado com sucesso" });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Erro ao inserir/atualizar expediente" });
    });
});

module.exports = router;
