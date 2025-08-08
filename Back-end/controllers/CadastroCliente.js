const db = require("../server/db");

const cadastroCliente = async ({ nome, telefone, cpf }) => {
  const [clienteExistente] = await db.execute(
    "SELECT ID FROM connect.clientes WHERE CPF = ?",
    [cpf]
  );

  if (clienteExistente.length === 0) {
    await db.execute(
      `INSERT INTO connect.clientes (CLIENTE_NOME, TELEFONE, CPF, STATUS, TRABALHOS)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, telefone, cpf, "Ativo", 0]
    );
  }
};

module.exports = { cadastroCliente };
