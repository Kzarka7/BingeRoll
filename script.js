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

const displayUsername = document.getElementById("displayUsername");

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

    const loginUser = new Proxy({}, passwordHandler);

    loginUser.username = username;
    loginUser.password = password; 

    if (!loginUser.password) return;

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