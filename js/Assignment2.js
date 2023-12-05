const api = "http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";


document.addEventListener("DOMContentLoaded", function () {
    const songTableBody = document.querySelector("#song-table tbody");
    const filterButton = document.getElementById("filter-button");
    const resetButton = document.getElementById("reset-button");
    const tableSpans = document.querySelectorAll('.tableheader');
    let sortOrder = 1; // 1 for ascending, -1 for descending
    let originalData; // Store the original data to reset the table after filtering
    

    // Check if song data is already in local storage
    let songData = JSON.parse(localStorage.getItem("songData"));

    if (!songData) {
        // If not in local storage, fetch from API and store in local storage
        fetch(api)
            .then(response => response.json())
            .then(data => {
                songData = data;
                localStorage.setItem("songData", JSON.stringify(songData));
                originalData = [...songData];
                populateSongTable(songData);
                populateSelect("#artist-select", data.map(song => song.artist));
                populateSelect("#genre-select", data.map(song => song.genre));
            })
            .catch(error => console.error("Error fetching data:", error));
    } else {
        // If data is in local storage, use it directly
        originalData = [...songData];
        populateSongTable(songData);
        populateSelect("#artist-select", songData.map(song => song.artist));
        populateSelect("#genre-select", songData.map(song => song.genre));
    }

    // Function to populate the song table
    function populateSongTable(data) {
        songTableBody.innerHTML = "";
        data.forEach(song => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="song-title" data-song-id="${song.song_id}">${song.title}</td>
                <td>${song.artist.name}</td>
                <td>${song.year}</td>
                <td>${song.genre.name}</td>
                <td>${song.details.popularity}</td>
            `;
            songTableBody.appendChild(row);
        });

        // Add event listener for song title clicks to navigate to Single Song View
        const songTitles = document.querySelectorAll(".song-title");
        songTitles.forEach(title => {
            title.addEventListener("click", () => {
                // Implement logic to change view to Single Song View
                console.log("Navigate to Single Song View with song ID:", title.dataset.songId);
            });
        });
    }

    // Add event listener for filter button
    filterButton.addEventListener("click", () => {
        // Implement logic to filter songs based on user input
        const titleFilter = document.getElementById("title-Radio").checked;
        const artistFilter = document.getElementById("artist-Radio").checked;
        const genreFilter = document.getElementById("genre-Radio").checked;
        const searchText = document.getElementById("title-Text").value.toLowerCase();
        const artistSelect = document.getElementById("artist-select");
        const selectedArtist = artistSelect.options[artistSelect.selectedIndex].text;
        const genreSelect = document.getElementById("genre-select");
        const selectedGenre = genreSelect.options[genreSelect.selectedIndex].text;

         // Filter the data based on user input
         songData = originalData.filter(song => {
            return (!titleFilter || song.title.toLowerCase().includes(searchText)) &&
                   (!artistFilter || song.artist.name === selectedArtist) &&
                   (!genreFilter || song.genre.name === selectedGenre);
        });

        // Repopulate the table with filtered data
        populateSongTable(songData);
    });

    // Add event listener for reset button
    resetButton.addEventListener("click", () => {
        // Reset the data to the original state
        songData = originalData;

        // Repopulate the table with original data
        populateSongTable(songData);
    });


    function populateSelect(selector, list){
        const select = document.querySelector(selector);
        const addedOptions = [];
        
        list.forEach(options => {
           if (!addedOptions.includes(options.name)) {
            const option = document.createElement("option");
            option.textContent = options.name;
            select.appendChild(option);
            addedOptions.push(options.name);
        }
        });
    }

    // Deals with the sorting mechanics and fuctionality
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