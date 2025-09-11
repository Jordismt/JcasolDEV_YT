require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');


const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
// Servir frontend estático (carpeta public)
app.use(express.static('public'));


// Rutas API
app.use('/api/contacts', contactRoutes);


// Error handler básico
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ error: 'Internal Server Error' });
});


const PORT = process.env.PORT || 5000;


mongoose
.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('Conectado a MongoDB');
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
})
.catch((err) => {
console.error('Error conectando a MongoDB:', err.message);
});