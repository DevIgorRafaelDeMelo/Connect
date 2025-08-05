const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, "SEGREDO_DO_TOKEN");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ mensagem: "Token inválido ou expirado" });
  }
}

module.exports = authMiddleware;
