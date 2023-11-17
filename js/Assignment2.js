
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
