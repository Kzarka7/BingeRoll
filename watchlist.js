const API_KEY = "54ae3fd";

const watchlistContainer = document.getElementById("watchlistContainer");
const searchForm = document.querySelector(".search");

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

const displayUsername = document.getElementById("displayUsername");

const loggedInUser = localStorage.getItem("loggedInUser");

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
                    <p style = "text-transform: capitalize">${movie.Type}</p>
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

// LOGOUT SYSTEM
signIn.addEventListener("click", () => {

    const loggedInUser = localStorage.getItem("loggedInUser");

    if (loggedInUser) {
        // ===== LOGOUT =====
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.href = "index.html";
        updateAuthButton();
    } else {
        // ===== OPEN LOGIN =====
        registerModal.style.display = "none";
        loginModal.style.display = "flex";
    }
});

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

    const user = new Proxy({}, passwordHandler);

    user.username = username;
    user.password = password; 

    if (!user.password) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        alert("Username already exists.");
        return;
    }

    users.push(user);

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

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

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

// BLOCKS THE PASSWORD IF ITS BELOW 6 DIGITS OR CHARACTERS
const passwordHandler = {
    set(target, prop, value) {

        if (prop === "password" && value.length < 6) {
            alert("Password must be at least 6 characters long.");
            return false; 
        }

        target[prop] = value;
        return true;
    }
};

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

document.querySelectorAll(".togglePassword").forEach(button => {
    button.addEventListener("click", function () {

        const container = this.parentElement;
        const passwordInput = container.querySelector("input");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }

    });
});

updateAuthButton();