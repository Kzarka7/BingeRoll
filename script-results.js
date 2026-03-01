const API_KEY = "54ae3fd";

const movieResults = document.getElementById("movieResults");
const searchTitle = document.getElementById("searchTitle");

const params = new URLSearchParams(window.location.search);

const movieName = params.get("movie");

// SIGNIN BUTTON IN NAV AND THE 2 MODALS ID
const signIn = document.getElementById("signIn");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

// LOGIN AND REGISTER ID IN ANCHOR INSIDE MODAL BODY 
const openLogin = document.getElementById("openLogin");
const openRegister = document.getElementById("openRegister");

// CONFIRMATION LOGIN OR REGISTER BUTTON ID
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

// CLOSE BUTTON ID
const closeButton = document.querySelectorAll(".closeButton");

// NAV WATCHLIST ID
const watchlistButton = document.getElementById("watchlistButton");

// SEARCH BUTTON ID FOR MOBILE
const searchButton = document.querySelector(".searchButton");
const mobileSearchContainer = document.querySelector(".mobileSearchContainer");

const displayUsername = document.getElementById("displayUsername");

// PRINTING RESULTS
if (movieName) {

    searchTitle.textContent = "Results for: " + movieName;

    searchMovies(movieName);

} else {

    searchTitle.textContent = "No search provided...";

}

// SEARCH FUNCTION
function searchMovies(movieName) {

    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${movieName}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.Response === "False") {

                movieResults.innerHTML = "<p>No movies found...</p>";
                return;

            }

            displayMovies(data.Search);

        });

}

// MOVIE DISPLAY FUNCTION
function displayMovies(movies) {

    movieResults.innerHTML = "";

    movies.forEach(movie => {

        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
            .then(response => response.json())
            .then(fullMovie => {

                const div = document.createElement("div");

                div.classList.add("movieContainer");

                div.innerHTML = `
                    <div class = "movieCard">
                        <img src="${fullMovie.Poster}">

                        <div class="movieInfo">
                            <h4>${fullMovie.Title}</h4>
                            <p>Released: ${fullMovie.Year}</p>
                            <p>Genre: ${fullMovie.Genre}</p>
                            <p style = "text-transform: capitalize">${fullMovie.Type}</p>
                            <p>Rating: ⭐ ${fullMovie.imdbRating}</p>
                        </div>
                    </div>
                    <div class = "movieButtons">
                        <button onclick="addToWatchlist('${fullMovie.imdbID}')"><i class="fa-regular fa-bookmark"></i></button>
                        <button onclick="getMovieDetails('${movie.imdbID}')"><i class="fa-regular fa-circle-question"></i></button>
                    </div>
                `;

                movieResults.appendChild(div);

            });

    });

}

// WATCHLIST FUNCTION, BLOCKS THE USER OR ADD MOVIE TO WATCHLIST IF THE USER IS LOGGED IN AND CLICK BOOKMARK ICON
function addToWatchlist(imdbID) {

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        loginModal.style.display = "flex";
        registerModal.style.display = "none";
        return;
    }

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`)
        .then(response => response.json())
        .then(movie => {

            // 🔥 Watchlist key is now based on username
            const watchlistKey = `watchlist_${loggedInUser}`;

            let watchlist = JSON.parse(localStorage.getItem(watchlistKey)) || [];

            const exists = watchlist.find(item => item.imdbID === movie.imdbID);

            if (exists) {
                alert("Movie already in watchlist");
                return;
            }

            watchlist.push(movie);

            localStorage.setItem(watchlistKey, JSON.stringify(watchlist));

            alert("Added to Watchlist");
        });
}

// MOVIE DETAIL FUNCTION, WHEN CLICKING THE INFO ICON ALERT POPS UP
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

// WHEN CLICKING NAV WATCH LIST BLOCKS THE USER IF NOT LOGGED IN
watchlistButton.addEventListener("click", (e) => {

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        e.preventDefault(); // stop page redirect
        loginModal.style.display = "flex";
        registerModal.style.display = "none";
    }

});

// OPEN REGISTER ANCHOR
openRegister.addEventListener("click", () => {
    registerModal.style.display = "flex";
    loginModal.style.display = "none";
});


// OPEN LOGIN ANCHOR
openLogin.addEventListener("click", () => {
    registerModal.style.display = "none";
    loginModal.style.display = "flex";
});

// CLOSE BUTTON
closeButton.forEach(button => {
    button.addEventListener("click", () => {
        loginModal.style.display = "none";
        registerModal.style.display = "none";
    });
});

// CLOSE MODAL WHEN CLICK OUTSIDE THE MODAL
window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = "none";
    }

    if (e.target === registerModal) {
        registerModal.style.display = "none";
    }
});

// LOGS OUT THE USER
signIn.addEventListener("click", () => {

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        // ===== LOGOUT =====
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        updateAuthButton();
    } else {
        // ===== OPEN LOGIN =====
        registerModal.style.display = "none";
        loginModal.style.display = "flex";
    }
});

// CHANGES THE TEXT IN THE NAV BUTTON FOR THE SIGN IN
function updateAuthButton() {

    const loggedInUser = localStorage.getItem("loggedInUser");
    const navText = signIn.querySelector(".nav-text");
    const icon = signIn.querySelector("i");

    if (loggedInUser) {
        displayUsername.textContent = loggedInUser;
        displayUsername.style.display = "block";
        
        navText.style.display = "none"
        icon.className = "fa-solid fa-right-from-bracket";
    } else {
        displayUsername.style.display = "none";

        navText.textContent = "Sign In";
        navText.style.display = "inline";
        icon.className = "fa-solid fa-user";
    }
}

// REGISTER FUNCTION MODAL
registerButton.addEventListener("click", (e) => {

    e.preventDefault();

    const username = registerModal.querySelector(".modalUser input").value.trim();
    const password = registerModal.querySelector(".modalPass input").value;
    const repPassword = document.getElementById("repPassword").value;

    if (!username || !password || !repPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== repPassword) {
        alert("Passwords do not match.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        alert("Username already exists.");
        return;
    }

    users.push({
        username: username,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");

    registerModal.style.display = "none";
    loginModal.style.display = "flex";

});

// LOGIN FUNCTION MODAL
loginButton.addEventListener("click", (e) => {

    e.preventDefault();

    const username = loginModal.querySelector("input[type='text']").value.trim();
    const password = loginModal.querySelector(".modalPass input").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const validUser = users.find(user => 
        user.username === username && user.password === password
    );

    if (!validUser) {
        alert("Invalid username or password.");
        return;
    }

    localStorage.setItem("loggedInUser", username);

    alert("Login successful!");

    updateAuthButton();

    loginModal.style.display = "none";

});

// SEARCH BUTTON FOR MOBILE
searchButton.addEventListener("click", () => {

    if (mobileSearchContainer.style.display === "block") {
        mobileSearchContainer.style.display = "none";
    } else {
        mobileSearchContainer.style.display = "block";
    }

});

document.querySelectorAll(".togglePassword").forEach(button => {
    button.addEventListener("click", function () {

        const passwordInput = this.previousElementSibling;

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }

    });
});

updateAuthButton();