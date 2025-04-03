// almacenar los tickets
let tickets = JSON.parse(localStorage.getItem('ticketsBackup')) || [];
let nextId = tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1;

// Referencias a elementos del DOM
const ticketForm = document.getElementById('ticketForm');
const ticketIdInput = document.getElementById('ticketId');
const nombreInput = document.getElementById('nombre');
const destinoInput = document.getElementById('destino');
const cancelEditButton = document.getElementById('cancelEdit');
const ticketsTableBody = document.querySelector('#ticketsTable tbody');

//  back-up en localStorage
function backupTickets() {
  localStorage.setItem('ticketsBackup', JSON.stringify(tickets));
}

// Función para refrescar la tabla de tickets
function renderTickets() {
  ticketsTableBody.innerHTML = '';
  tickets.forEach(ticket => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ticket.id}</td>
      <td>${ticket.nombre}</td>
      <td>${ticket.destino}</td>
      <td>
        <button onclick="editTicket(${ticket.id})">Editar</button>
        <button onclick="deleteTicket(${ticket.id})">Eliminar</button>
      </td>
    `;
    ticketsTableBody.appendChild(tr);
  });
}

// Freinicia el formulario
function resetForm() {
  ticketForm.reset();
  ticketIdInput.value = '';
  cancelEditButton.style.display = 'none';
}

// Función para crear o actualizar un ticket
ticketForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const id = ticketIdInput.value;
  const nombre = nombreInput.value.trim();
  const destino = destinoInput.value.trim();

  if (nombre === '' || destino === '') {
    alert('Por favor, complete todos los campos.');
    return;
  }

  if (id) {

    // ACTUALIZARA SOBRE LOS CAMBIOS DEL TICKET
    const index = tickets.findIndex(ticket => ticket.id == id);
    if (index !== -1) {
      tickets[index].nombre = nombre;
      tickets[index].destino = destino;
      alert('Ticket actualizado exitosamente.');
    }
  } else {
    // agregarara y CREARA UN NUEVO REGISTRO
    const nuevoTicket = { id: nextId++, nombre, destino };
    tickets.push(nuevoTicket);
    alert('Ticket creado exitosamente.');
  }

  renderTickets();
  backupTickets();
  resetForm();
});

// funcion PARA EL TICKET DE EDITAR, CAMBIAR
window.editTicket = function(id) {
  const ticket = tickets.find(ticket => ticket.id === id);
  if (ticket) {
    ticketIdInput.value = ticket.id;
    nombreInput.value = ticket.nombre;
    destinoInput.value = ticket.destino;
    cancelEditButton.style.display = 'inline';
  }
};

// FUNCION DEL TIKET PAR AELIMINAR
window.deleteTicket = function(id) {
  if (confirm('¿Está seguro de eliminar este ticket?')) {
    tickets = tickets.filter(ticket => ticket.id !== id);
    renderTickets();
    backupTickets();
  }
};

// Cancelar edición y reiniciar formulario
cancelEditButton.addEventListener('click', resetForm);

// Cargar tickets desde el almacenamiento al cargar la página
renderTickets();