// URL base de nuestra API
const API_URL = '/api/contacts';

// --- Helpers ---
// Función rápida para seleccionar elementos del DOM
function qs(sel) {
  return document.querySelector(sel);
}

// Escapar caracteres para evitar problemas de HTML/JS injection
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Funciones para comunicarse con la API ---
// Traer contactos, opcionalmente filtrando por búsqueda
async function fetchContacts(q = '') {
  const url = q ? `${API_URL}?q=${encodeURIComponent(q)}` : API_URL;
  const res = await fetch(url);
  return res.json();
}

// --- Renderizar contactos en la tabla ---
async function renderContacts(q = '') {
  const contacts = await fetchContacts(q);
  const tbody = qs('#contacts-tbody');

  // Si no hay contactos, mostrar mensaje
  if (!contacts || contacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No hay contactos</td></tr>';
    return;
  }

  // Generar filas HTML con los datos de cada contacto
  tbody.innerHTML = contacts
    .map(
      (c) => `
      <tr data-id="${c._id}">
        <td>${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.email)}</td>
        <td>${escapeHtml(c.phone || '')}</td>
        <td>
          <button class="edit-btn" data-id="${c._id}">Editar</button>
          <button class="delete-btn" data-id="${c._id}">Borrar</button>
        </td>
      </tr>`
    )
    .join('');

  // --- Agregar eventos a los botones Borrar ---
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Borrar contacto?')) return;
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      renderContacts(qs('#search').value); // refrescar tabla
    });
  });

  // --- Agregar eventos a los botones Editar ---
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const res = await fetch(`${API_URL}/${id}`);
      const contact = await res.json();

      // Llenar formulario con los datos del contacto
      qs('#contact-id').value = contact._id;
      qs('#name').value = contact.name || '';
      qs('#email').value = contact.email || '';
      qs('#phone').value = contact.phone || '';
      qs('#notes').value = contact.notes || '';
      qs('#cancel-edit').style.display = 'inline-block'; // mostrar botón cancelar
    });
  });
}

// --- Manejo del formulario de contacto --- 
qs('#contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = qs('#contact-id').value; // si tiene id, es update
  const payload = {
    name: qs('#name').value.trim(),
    email: qs('#email').value.trim(),
    phone: qs('#phone').value.trim(),
    notes: qs('#notes').value.trim()
  };

  // Validación básica
  if (!payload.name || !payload.email) {
    alert('Nombre y email son obligatorios');
    return;
  }

  if (id) {
    // --- Actualizar contacto ---
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    // --- Crear nuevo contacto ---
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  // Limpiar formulario y refrescar tabla
  qs('#contact-id').value = '';
  qs('#contact-form').reset();
  qs('#cancel-edit').style.display = 'none';
  renderContacts(qs('#search').value);
});

// --- Buscar mientras se escribe ---
qs('#search').addEventListener('keyup', async (e) => {
  const query = e.target.value.trim();
  await renderContacts(query); // refrescar tabla filtrando
});

// --- Inicializar la tabla al cargar la página ---
renderContacts();
