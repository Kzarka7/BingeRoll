const API_KEY = "54ae3fd";

const watchlistContainer = document.getElementById("watchlistContainer");
const signInBtn = document.getElementById("signIn");
const searchForm = document.querySelector(".search");

const displayUsername = document.getElementById("displayUsername");

const loggedInUser = localStorage.getItem("loggedInUser");

// DISPLAY USERNAME IN NAV
if (loggedInUser) {
    displayUsername.textContent = loggedInUser;
    displayUsername.style.display = "inline";
} else {
    displayUsername.style.display = "none";
}

const searchButton = document.querySelector(".searchButton");
const mobileSearchContainer = document.querySelector(".mobileSearchContainer");

// AUTH CHECKER
if (!loggedInUser) {

    watchlistContainer.innerHTML = `
        <div style="text-align:center; margin-top:50px;">
            <h2>Please login to view your watchlist.</h2>
        </div>
    `;

} else {
    loadWatchlist();
}


// LOAD WATCHLISTS
function loadWatchlist() {

    const watchlistKey = `watchlist_${loggedInUser}`;
    let watchlist = JSON.parse(localStorage.getItem(watchlistKey)) || [];

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = "<p>No movies in watchlist yet...</p>";
        return;
    }

    displayWatchlist(watchlist);
}


// DISPLAY MOVIES
function displayWatchlist(movies) {

    watchlistContainer.innerHTML = "";

    movies.forEach(movie => {

        const div = document.createElement("div");
        div.classList.add("movieContainer");

        div.innerHTML = `
            <div class="movieCard">
                <img src="${movie.Poster}">
                <div class="movieInfo">
                    <h4>${movie.Title}</h4>
                    <p>Released: ${movie.Year}</p>
                    <p>Genre: ${movie.Genre}</p>
                    <p style = "text-transform: capitalize">${movie.Type}</p>
                    <p>Rating: ⭐ ${movie.imdbRating}</p>
                </div>
            </div>
            <div class="movieButtons">
                <button onclick="removeFromWatchlist('${movie.imdbID}')">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
                <button onclick="getMovieDetails('${movie.imdbID}')">
                    <i class="fa-regular fa-circle-question"></i>
                </button>
            </div>
        `;

        watchlistContainer.appendChild(div);
    });
}


// REMOVE MOVIE FROM WATCHLIST
function removeFromWatchlist(imdbID) {

    const watchlistKey = `watchlist_${loggedInUser}`;
    let watchlist = JSON.parse(localStorage.getItem(watchlistKey)) || [];

    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);

    localStorage.setItem(watchlistKey, JSON.stringify(watchlist));

    loadWatchlist(); // refresh without reload
}


// MOVIE DETAILS
function getMovieDetails(imdbID) {

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;

    fetch(url)
        .then(response => response.json())
        .then(movie => {

            const oldModal = document.querySelector(".infoContainer");
            if (oldModal) oldModal.remove();

            const div = document.createElement("div");

            div.classList.add("infoContainer");

            div.innerHTML = `
            
                <div class = "info">
                    <div class = "infoCard">
                        <button class="closeInfo">&times;</button>

                        <div class = "infoHeader">
                            <img src="${movie.Poster}">
                            <div class = "infoContent">
                                <h2>${movie.Title}</h2>
                                <div class = "infoDetails">
                                    <p>Released: ${movie.Year}</p>
                                    <p>Genre: ${movie.Genre}</p>
                                    <p style = "text-transform: capitalize">${movie.Type}</p>
                                    <p>Rating: ⭐ ${movie.imdbRating}</p>
                                </div>
                            </div>
                        </div>
                        <p class = "infoPlot">${movie.Plot}</p>
                    </div>
                </div>

            `;

            document.body.appendChild(div);

            // close button
            div.querySelector(".closeInfo").addEventListener("click", () => {
                div.remove();
            });

            // click outside card closes modal
            div.querySelector(".info").addEventListener("click", () => {
                div.remove();
            });

        });

}

// LOGOUT SYSTEM
signInBtn.addEventListener("click", () => {

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully!");

    window.location.href = "index.html";
});


// SEARCH FORM
searchForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const searchInput = document.getElementById("searchInput").value.trim();

    if (searchInput !== "") {
        window.location.href = `results.html?movie=${searchInput}`;
    }

});

// SEARCH BUTTON FOR MOBILE
searchButton.addEventListener("click", () => {

    if (mobileSearchContainer.style.display === "block") {
        mobileSearchContainer.style.display = "none";
    } else {
        mobileSearchContainer.style.display = "block";
    }

});