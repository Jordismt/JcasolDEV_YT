const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend"))); // Servir frontend

// Cargar respuestas desde JSON
const responsesPath = path.join(__dirname, "responses.json");
let responses = JSON.parse(fs.readFileSync(responsesPath, "utf8"));

// Función para obtener respuesta aleatoria
function getReply(message) {
  message = message.toLowerCase();
  let replyArray = responses["default"];

  for (let key in responses) {
    if (message.includes(key)) {
      replyArray = responses[key];
      break;
    }
  }

  // Si hay varias respuestas, elegir una al azar
  if (Array.isArray(replyArray)) {
    return replyArray[Math.floor(Math.random() * replyArray.length)];
  }

  return replyArray;
}

// Endpoint de chat
app.post("/chat", (req, res) => {
  const msg = req.body.message;
  const reply = getReply(msg);
  res.json({ reply });
});

app.listen(PORT, () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);
