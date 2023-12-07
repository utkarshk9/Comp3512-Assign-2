const api = "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";


document.addEventListener("DOMContentLoaded", function () {
    const songTableBody = document.querySelector("#song-table tbody");
    const filterButton = document.getElementById("filter-button");
    const resetButton = document.getElementById("reset-button");
    const tableSpans = document.querySelectorAll('.tableheader');
    let sortOrder = 1; // 1 for ascending, -1 for descending
    let originalData;



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
    function populateSongTable(songData) {
        songTableBody.innerHTML = "";
        songData.forEach(song => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="song-title" data-song-id="${song.song_id}">${song.title}</td>
                <td>${song.artist.name}</td>
                <td>${song.year}</td>
                <td>${song.genre.name}</td>
                <td>${song.details.popularity}</td>
                <button class="add-to-playlist" data-song-id="${song.song_id}">Add to Playlist</button>`;
            songTableBody.appendChild(row);
        });
        // Add event listener for song title clicks to navigate to Single Song View
        const songTitles = document.querySelectorAll(".song-title");
        songTitles.forEach(title => {
            title.addEventListener("click", () => {

                console.log("Navigate to Single Song View with song ID:", title.dataset.songId);
            });
        });
        // Add event listeners for "Add to Playlist" buttons
        const addToPlaylistButtons = document.querySelectorAll(".add-to-playlist");
        addToPlaylistButtons.forEach(button => {
            button.addEventListener("click", () => {
                const songId = button.getAttribute('data-song-id'); // Declare songId here
                console.log("Add to Playlist clicked for song ID:", songId);
                addSongToPlaylist(songId);
            });
        });
    }
    function showNotification() {
        const notification = document.getElementById("notification");
        notification.style.display = "block";
    
        // Hide the notification after 3 seconds
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }
    // div.addEventListener("click", () => {
    //     if(!this.find('input:radio').prop('checked')) {
    //         this.find('input:radio').prop('checked', true);
    //     }

    //     else {
    //         this.find('input:radio').prop('checked', false);
    //     }
    // });

    // Add event listener for filter button
    filterButton.addEventListener("click", () => {

        const titleFilter = document.getElementById("title-Radio").checked;
        const artistFilter = document.getElementById("artist-Radio").checked;
        const genreFilter = document.getElementById("genre-Radio").checked;
        const searchText = document.getElementById("title-Text").value.toLowerCase();
        const artistSelect = document.getElementById("artist-select");
        const selectedArtist = artistSelect.options[artistSelect.selectedIndex].text;
        const genreSelect = document.getElementById("genre-select");
        const selectedGenre = genreSelect.options[genreSelect.selectedIndex].text;


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


    function populateSelect(selector, list) {
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

    tableSpans.forEach(function (span) {
        span.addEventListener('click', function () {

            var th = span.parentElement;
            var columnIndex = Array.from(th.parentElement.children).indexOf(th);
            var rows = document.querySelectorAll('#song-table tbody tr');
            var rowsArray = Array.from(rows);

            rowsArray.sort(function (a, b) {
                var firstValue = a.children[columnIndex].innerText.trim().toLowerCase();
                var secondValue = b.children[columnIndex].innerText.trim().toLowerCase();

                if (firstValue < secondValue) return -sortOrder;
                if (firstValue > secondValue) return sortOrder;

                return 0;
            });

            var tbody = document.querySelector('#song-table tbody');
            tbody.innerHTML = '';

            rowsArray.forEach(function (row) {
                tbody.appendChild(row);
            });

            tableSpans.forEach(function (otherSpan) {
                if (otherSpan !== span) {
                    otherSpan.innerHTML = otherSpan.innerText;
                }
            });

            sortOrder *= -1;

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


    //-----------------------------------------------------Single View Page----------------------------------------------------
    function singleView(song) {
        const hideElement = (element) => element.style.display = 'none';
        const showElement = (element) => element.style.display = 'block';

        const songTable = document.getElementById('song-table');
        const playlistTable = document.getElementById('playlist-table');
        const singleViewContainer = document.getElementById('singleSongViewContainer');

        // Hide the song table and playlist table
        hideElement(songTable);
        hideElement(playlistTable);

        // Show the single song view
        showElement(singleViewContainer);


        displaySongDetails(song);
        displayRadarChart(song);

        const backButton = document.getElementById("closeViewButton")
        backButton.addEventListener('click', () => {
            hideElement(singleViewContainer);
            showElement(songTable);
        });


        singleViewContainer.appendChild(backButton);
    }


    // song radar chart and song detail function.

    const songTitles = document.querySelector("#song-table");

    songTitles.addEventListener("click", (event) => {
        const clickedElement = event.target;
        if (clickedElement.classList.contains("song-title")) {
            const songId1 = clickedElement.getAttribute("data-song-id");
            const selectedSong = songData.find((song) => song.song_id == songId1);
            singleView(selectedSong);
        }
    });


    function displaySongDetails(song) {
        const details = document.querySelector('#songDetailsContainer');

        const mins = Math.floor(song.details.duration / 60);
        const secs = song.details.duration % 60;
        const durationString = `${mins} mins and ${secs} secs`;

        details.innerHTML = `
        <h2>${song.title}</h2>
        <p>Artist: ${song.artist.name}</p>
        <p>Genre: ${song.genre.name}</p>
        <p>Year: ${song.year}</p>
        <p>Duration: ${durationString}</p>
        <p>BPM: ${song.details.bpm}</p>
        <p>Energy: ${song.analytics.energy}</p>
        <p>Danceability: ${song.analytics.danceability}</p>
        <p>Valence: ${song.analytics.valence}</p>
        <p>Speechiness: ${song.analytics.speechiness}</p>
        <p>Liveness: ${song.analytics.liveness}</p>
        <p>Popularity: ${song.details.popularity}</p>
    `;
    }

    function displayRadarChart(song) {
        const radarContainer = document.querySelector('#radarChartContainer');
        radarContainer.innerHTML = '<canvas id="radarChart"></canvas>';

        const radarChartCanvas = document.getElementById('radarChart').getContext('2d');
        new Chart(radarChartCanvas, {
            type: 'radar',
            data: {
                labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acousticness', 'Speechiness'],
                datasets: [{
                    label: 'Song Analytics',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 4,
                    data: [
                        song.analytics.energy,
                        song.analytics.danceability,
                        song.analytics.liveness,
                        song.analytics.valence,
                        song.analytics.acousticness,
                        song.analytics.speechiness
                    ]
                }]
            },
            options: {
                scale: {
                    ticks: { beginAtZero: true, max: 100 },
                    pointLabels: { fontSize: 26 }
                },
                legend: { display: false }
            }
        });


    }

    //-----------------------------------------------------Playlist View----------------------------------------------------
    document.getElementById("playlist-button").addEventListener("click", () => {
        toggleView();
    });
    function toggleView() {
        const songTableView = document.getElementById("song-table");
        const playlistView = document.getElementById("playlist-table");
        const singleSongView = document.getElementById("singleSongViewContainer");

        // Hide song table and single song view
        songTableView.style.display = "none";
        singleSongView.style.display = "none";

        // Show playlist view
        playlistView.style.display = "block";
    }
    let playlist = [];

    // Function to populate the playlist table
    function populatePlaylistTable() {
        const playlistTableBody = document.querySelector("#playlist-table tbody");
        playlistTableBody.innerHTML = ""; // Clear current playlist view

        playlist.forEach(song => {
            const row = document.createElement("tr");
            row.innerHTML = `
             <td class="song-title" style="cursor: pointer;" data-song-id="${song.song_id}">${song.title}</td>
             <td>${song.artist.name}</td>
             <td>${song.year}</td>
             <td>${song.genre.name}</td>
             <td>${song.details.popularity}</td>
             <td><button class="remove-from-playlist" data-song-id="${song.song_id}">Remove</button></td>
         `;
            playlistTableBody.appendChild(row);
        });

        // Add click event for Single Song View
        document.querySelectorAll(".song-title").forEach(title => {
            title.addEventListener("click", () => {
                singleView(title.dataset.songId); // Implement this function as needed
            });
        });

        // Add click event for removing songs
        document.querySelectorAll(".remove-from-playlist").forEach(button => {
            button.addEventListener("click", () => {
                removeSongFromPlaylist(button.dataset.songId);
            });
        });

        // Update summary information
        //updatePlaylistSummary();
    }

    // Function to remove a song from the playlist
    function removeSongFromPlaylist(songId) {
        playlist = playlist.filter(song => song.song_id != songId);
        populatePlaylistTable(); // Update the playlist view
        updatePlaylistSummary();
    }
    function clearPlaylist() {
        playlist = [];
        populatePlaylistTable(); // Update the playlist view
        updatePlaylistSummary(); // Update the summary info
    }
    document.getElementById("clear-playlist-button").addEventListener("click", clearPlaylist);
    // Attach this function to a 'Clear Playlist' button
    //document.getElementById("clear-playlist-button").addEventListener("click", clearPlaylist);
    function updatePlaylistSummary() {
        const numSongs = playlist.length;
        let avgPopularity = 0;

        if (numSongs > 0) {
            const totalPopularity = playlist.reduce((acc, song) => acc + song.details.popularity, 0);
            avgPopularity = totalPopularity / numSongs;
        }

        const summaryElement = document.getElementById("playlist-summary");
        summaryElement.textContent = `Songs: ${numSongs}, Average Popularity: ${avgPopularity.toFixed(2)}`;
    }



    // adding a song to the playlist
   
    function addSongToPlaylist(songId) {
        const songToAdd = originalData.find(song => song.song_id == songId);
        if (songToAdd && !playlist.some(song => song.song_id == songId)) {
            console.log("Adding song:", songToAdd.title); // Debugging line
            playlist.push(songToAdd);
            populatePlaylistTable(); // Update the playlist view
            updatePlaylistSummary();
            showNotification();
        } else {
            console.log("Song already in playlist or not found"); // Debugging line
        }
       
    }
    function closeView() {
        const songTableView = document.getElementById("song-table");
        const playlistView = document.getElementById("playlist-table");
        const singleSongView = document.getElementById("singleSongViewContainer");
    
        // Show the song table view
        songTableView.style.display = "block";
    
        // Hide the playlist and single song view
        playlistView.style.display = "none";
        singleSongView.style.display = "none";
    }
    document.getElementById("close-view-button").addEventListener("click", closeView);
});