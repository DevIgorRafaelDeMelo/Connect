const db = require("./db");

async function getClientByID(id) {
  try {
    const [rows] = await db.query("SELECT * FROM agenda WHERE ID = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Erro ao buscar cliente por CPF:", error);
    throw error;
  }
}

async function getClientByIdUser(id) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM clientes WHERE REPLACE(REPLACE(REPLACE(CPF, '.', ''), '-', ''), ' ', '')  = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Erro ao buscar cliente por CPF:", error);
    throw error;
  }
}

async function getDepartamento() {
  try {
    const [rows] = await db.query("SELECT * FROM DEPARTAMENTO");
    return rows;
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error);
    throw error;
  }
}

async function getCargos() {
  try {
    const [rows] = await db.query("SELECT * FROM CARGO");

    return rows;
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    throw error;
  }
}

async function getClientsByCPF(cpf) {
  try {
    const cpfLimpo = cpf.replace(/\D/g, "");

    const [rows] = await db.query(
      "SELECT  * FROM agenda WHERE REPLACE(REPLACE(REPLACE(CPF, '.', ''), '-', ''), ' ', '') = ?",
      [cpfLimpo]
    );

    return rows;
  } catch (error) {
    console.error("Erro ao buscar clientes por CPF:", error);
    throw error;
  }
}

async function getClients() {
  try {
    const [rows] = await db.query("SELECT  * FROM clientes ");

    return rows;
  } catch (error) {
    console.error("Erro ao buscar clientes por CPF:", error);
    throw error;
  }
}

async function getClientsAgenda(id) {
  try {
    const [rows] = await db.query("SELECT  * FROM agenda WHERE ID = ?", [id]);

    return rows[0];
  } catch (error) {
    console.error("Erro ao buscar clientes por CPF:", error);
    throw error;
  }
}

async function getServicos() {
  try {
    const [rows] = await db.query("SELECT  * FROM tipos_servico ");

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getColaboradores() {
  try {
    const [rows] = await db.query("SELECT  * FROM funcionarios ");
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getDispensas() {
  try {
    const [rows] = await db.query("SELECT  * FROM dispensas ");

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getContas() {
  try {
    const [rows] = await db.query("SELECT  * FROM contas ");

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getParcelas(id) {
  try {
    const [rows] = await db.query("SELECT * FROM parcelas WHERE ID_CONTA = ?", [
      id,
    ]);

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getClientByID,
  getClientsByCPF,
  getClients,
  getServicos,
  getColaboradores,
  getClientsAgenda,
  getClientByIdUser,
  getDispensas,
  getDepartamento,
  getCargos,
  getContas,
  getParcelas,
};
