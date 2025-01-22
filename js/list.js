let apiUrl = `http://127.0.0.1:8000/api/bookings/list/`;
const table = document.getElementById('booking-table');
const tableBody = document.getElementById('booking-body');
const loading = document.getElementById('loading');
const noData = document.getElementById('no-data');
let selectedCriteria;


async function uploadTable(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    const bookings = response.data;

    loading.textContent = 'caricamento...';
    tableBody.innerHTML = '';

    if (bookings.length === 0) {
      loading.classList.add('d-none');
      noData.classList.remove('d-none');
      return;
    }

    // Aggiorna il DOM con i dati delle prenotazioni
    bookings.forEach((booking) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking.name}</td>
      <td>${booking.lab}</td>
      <td>${booking.date}</td>
      <td>${booking.start_time}</td>
      <td>${booking.end_time}</td>
      <td>${booking.is_archived ? 'Sì' : 'No'}</td>
      `;
      tableBody.appendChild(row);
    });

    // Mostra la tabella e nascondi il caricamento
    table.classList.remove('d-none');
    loading.classList.add('d-none');
  } catch (error) {
    console.error('Errore nel recupero delle prenotazioni:', error);
    loading.textContent = 'Errore nel caricamento delle prenotazioni.';
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  const searchButton = document.querySelector('#search-button'); // Bottone "Cerca"
  const listAllButton = document.querySelector('#list-all-button'); //Bottone "Mostra tutte"
  const dropdownItems = document.querySelectorAll('.dropdown-item'); // Opzioni del menu a tendina
  const filterInput = document.querySelector('.form-control'); // Campo di input

  listAllButton.addEventListener('click', () => {
    uploadTable(`http://127.0.0.1:8000/api/bookings/list/`);
  });


  // Gestione del cambio criterio dal dropdown
  dropdownItems.forEach(item => {
    item.addEventListener('click', (event) => {
      event.preventDefault();

      selectedCriteria = item.dataset.criteria; // Recupera il criterio dal dataset
      if(selectedCriteria == 'date')
        filterInput.placeholder = `Inserire data in formato YYYY/MM/DD`; // Aggiorna il placeholder
      else if(selectedCriteria == 'name')
        filterInput.placeholder = `Inserire nome`; 
    });
  });

  // Gestione del click sul bottone "Cerca"
  searchButton.addEventListener('click', () => {
    loading.classList.remove('d-none');
    noData.classList.add('d-none');
    const filterValue = filterInput.value.trim(); // Recupera il valore del campo di input

    if (!filterInput) {
      alert("Inserisci un valore nella barra di ricerca")
      return;
    }

    // Determina l'URL dell'API in base al criterio selezionato
    let apiUrl;
    if (selectedCriteria === 'date') {
      apiUrl = `http://127.0.0.1:8000/api/bookings/list-by-date/${filterValue}/`;
    } else if (selectedCriteria === 'name') {
      apiUrl = `http://127.0.0.1:8000/api/bookings/list-by-name/${filterValue}/`;
    }

    uploadTable(apiUrl)
  });
});
