/* url of song api --- https versions hopefully a little later this semester */	
const api = "http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";

const songlist = JSON.parse(songs);
const genrelist = JSON.parse(genres);
const artistlist = JSON.parse(artists);

document.addEventListener("DOMContentLoaded", () => {
    populateSongsTable();
    populateSelect("#artist-select", artistlist);
    populateSelect("#genre-select", genrelist);
});

function populateSongsTable(){
    const table = document.querySelector("#song-table table tbody");
    
    songlist.forEach(song => {
        const row = document.createElement("tr");
        table.appendChild(row);

        // Add song details directly
        addCell(row, song.title);
        addCell(row, song.artist.name);
        addCell(row, song.year);
        addCell(row, song.genre.name);
        addCell(row, song.details.popularity);
    });
}

function addCell(row, data){
    const cell = document.createElement("td");
    cell.textContent = data;
    row.appendChild(cell);
}

function populateSelect(selector, list){
    const select = document.querySelector(selector);
    
    list.forEach(item => {
        const option = document.createElement("option");
        option.textContent = item.name;
        select.appendChild(option);
    });
}

// Deals with the sorting mechanics and fuctionality
document.addEventListener('DOMContentLoaded', function () {
   var tableSpans = document.querySelectorAll('.tableheader');
   var sortOrder = 1; // 1 for ascending, -1 for descending

   // Add a click event listener to each span
   tableSpans.forEach(function (span) {
       span.addEventListener('click', function () {
           // Get the parent th element
           var th = span.parentElement;

           // Get the index of the th element within its parent
           var columnIndex = Array.from(th.parentElement.children).indexOf(th);

           // Get all rows in the tbody
           var rows = document.querySelectorAll('#song-table tbody tr');

           // Convert NodeList to array for easier sorting
           var rowsArray = Array.from(rows);

           // Sort the rows based on the content of the clicked column
           rowsArray.sort(function (a, b) {
               var firstValue = a.children[columnIndex].innerText.trim().toLowerCase();
               var secondValue = b.children[columnIndex].innerText.trim().toLowerCase();

               if (firstValue < secondValue) return -sortOrder;
               if (firstValue > secondValue) return sortOrder;

               return 0;
           });

           // Clear the rows from the tbody
           var tbody = document.querySelector('#song-table tbody');
           tbody.innerHTML = '';

           // Append the sorted rows to the tbody
           rowsArray.forEach(function (row) {
               tbody.appendChild(row);
           });

           // Reset arrow icons in all headers
           tableSpans.forEach(function (otherSpan) {
               if (otherSpan !== span) {
                   otherSpan.innerHTML = otherSpan.innerText;
               }
           });

           // Toggle the sortOrder for the next click
           sortOrder *= -1;

           // Get the current text of the span
           var currentText = span.innerText;

           // Check if the arrow is '↑' or '↓'
           if (currentText.includes('↑')) {
               // Replace current arrow with '↓'
               span.innerHTML = currentText.replace('↑', '↓');
           } 
           
           else if (currentText.includes('↓')) {
               // Replace current arrow with '↑'
               span.innerHTML = currentText.replace('↓', '↑');
           } 
           
           else {
               // Add arrow icon for the first time
               span.innerHTML = currentText + (sortOrder === 1 ? ' ↑' : ' ↓');
           }
       });
   });
});