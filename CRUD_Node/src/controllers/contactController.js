const Contact = require('../models/Contact');


// Crear contacto
exports.createContact = async (req, res, next) => {
try {
const { name, email, phone, notes } = req.body;
if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });


const newContact = new Contact({ name, email, phone, notes });
await newContact.save();
res.status(201).json(newContact);
} catch (err) {
next(err);
}
};


// Listar (con búsqueda opcional `?q=`)
exports.getContacts = async (req, res, next) => {
try {
const { q } = req.query;
let filter = {};
if (q) {
const reg = new RegExp(q, 'i');
filter = { $or: [{ name: reg }, { email: reg }, { phone: reg }] };
}
const contacts = await Contact.find(filter).sort({ createdAt: -1 });
res.json(contacts);
} catch (err) {
next(err);
}
};


// Obtener por id
exports.getContactById = async (req, res, next) => {
try {
const contact = await Contact.findById(req.params.id);
if (!contact) return res.status(404).json({ message: 'Contact not found' });
res.json(contact);
} catch (err) {
next(err);
}
};


// Actualizar
exports.updateContact = async (req, res, next) => {
try {
const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
if (!contact) return res.status(404).json({ message: 'Contact not found' });
res.json(contact);
} catch (err) {
next(err);
}
};


// Eliminar
exports.deleteContact = async (req, res, next) => {
try {
const contact = await Contact.findByIdAndDelete(req.params.id);
if (!contact) return res.status(404).json({ message: 'Contact not found' });
res.json({ message: 'Contact deleted' });
} catch (err) {
next(err);
}
};