
/* url of song api --- https versions hopefully a little later this semester */	
const api = "http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";

 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

const artists = JSON.parse("Data_JS/Artist.JSON");
const genres = JSON.parse("Data_JS/Genre.JSON");
const songs = JSON.parse("Data_JS/Sample-songs.JSON");


document.addEventListener('DOMContentLoaded', () => {
   populateSelect('artist-select', artists, 'name');
   populateSelect('genre-select', genres, 'name');
   populateSongsTable();
});

function populateSelect(selectID, data, property){
   const select = document.getElementById(selectID);
   data.forEach(e => {
      const option = document.createElement('option');
      option.textContent = item[property];
      select.appendChild(option);
   });
}

function populateSongsTable() {
   const tableBody = document.getElementById('songs-table').getElementsByTagName('tbody')[0];
   songs.forEach(song => {
       const row = tableBody.insertRow();
       row.insertCell().textContent = song.title;
       row.insertCell().textContent = song.artist.name;
       row.insertCell().textContent = song.year;
       row.insertCell().textContent = song.genre.name;
       row.insertCell().textContent = song.details.popularity;
   });
}
function sortTable(columnIndex) {
   const table = document.getElementById('songs-table');
   const tableBody = table.tBodies[0];
   const rowsArray = Array.from(tableBody.rows);

   rowsArray.sort((rowA, rowB) => {
       const cellA = rowA.cells[columnIndex].textContent.toLowerCase();
       const cellB = rowB.cells[columnIndex].textContent.toLowerCase();
       return cellA.localeCompare(cellB);
   });

   // Re-adding rows in sorted order
   rowsArray.forEach(row => tbody.appendChild(row));
}