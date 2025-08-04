const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const agenda = require("./seguimento/agenda");

app.post("/agenda", agenda);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
