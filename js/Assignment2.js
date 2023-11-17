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
    const table = document.querySelector("#song-table table tbody");//.addEventListener('click', sorter);
    
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


function SortColumnListener() {
   const headers = document.querySelectorAll("#song-table table th");

   headers.forEach((header, index) => {
       header.addEventListener("click", () => {
           sortColumn(index);
       });
   });
}
function sorter(e) {
   const columnHeaders = ["Title", "Artist", "Year", "Genre", "Popularity"];
   const columnIndex = columnHeaders.indexOf(e.target.innerText);

   if (columnIndex !== -1) {
      tableSorter(columnIndex);
   }
}

function clearSort() {
   const spans = document.querySelectorAll(".tableSpan");
   for (const span of spans) {
      span.innerText = "";
   }
}

function setSort(column, direction) {
   const headerSpan = document.querySelector(`#song-list table thead tr th:nth-child(${column + 1}) .tableSpan`);
   headerSpan.innerText = direction === "ascend" ? "^" : "⌄";
}

function tableSorter(column) {
   clearSort();

   let switchMade = true;
   let direction = "ascend";

   setSorti(column, direction);

   while (switchMade) {
      const rows = document.querySelectorAll("#song-list table tbody tr");
      let count = 0;

      for (let i = 0; i < rows.length - 1; i++) {
         const compare1 = rows[i].children[column];
         const compare2 = rows[i + 1].children[column];

         switchMade = false;

         if ((compare1.innerText > compare2.innerText && direction === "ascend") ||
            (compare1.innerText < compare2.innerText && direction === "descend")) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switchMade = true;
            count++;
            break;
         }
      }

      if (count === 0 && direction === "ascend") {
         direction = "descend";
         setSort(column, direction);
         switchMade = true;
      }
   }
}