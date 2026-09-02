// AUTH: REGISTER, LOGIN, LOGOUT, GUARD (LOCALSTORAGE, VALIDASI SEDERHANA)
const usersKey = 'gamehub-users';
const sessionKey = 'gamehub-current-user';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');

// AMBIL & SIMPAN DATA USER
function loadUsers() {
    try {
        const raw = localStorage.getItem(usersKey);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

// SESSION USER YANG LAGI LOGIN
function setCurrentUser(username) {
    localStorage.setItem(sessionKey, username);
}

function getCurrentUser() {
    return localStorage.getItem(sessionKey);
}

function logout() {
    localStorage.removeItem(sessionKey);
    window.location.href = 'login.html';
}

// GUARD: LEMPAR KE LOGIN KALO BELUM LOGIN (DIPANGGIL DI HALAMAN YANG BUTUH LOGIN)
function guardPage() {
    if (!getCurrentUser()) {
        window.location.href = 'login.html';
    }
}

// PROSES LOGIN
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        const errorText = document.getElementById('login-error');

        const users = loadUsers();
        const found = users.find(function (u) {
            return u.username === username && u.password === password;
        });

        if (!found) {
            errorText.textContent = 'Username atau password salah.';
            return;
        }

        errorText.textContent = '';
        setCurrentUser(username);
        window.location.href = 'index.html';
    });
}

// PROSES REGISTER
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const errorText = document.getElementById('register-error');

        if (username.length < 3) {
            errorText.textContent = 'Username minimal 3 karakter.';
            return;
        }
        if (password.length < 6) {
            errorText.textContent = 'Password minimal 6 karakter.';
            return;
        }
        if (password !== confirmPassword) {
            errorText.textContent = 'Konfirmasi password tidak cocok.';
            return;
        }

        const users = loadUsers();
        const alreadyExists = users.some(function (u) {
            return u.username === username;
        });

        if (alreadyExists) {
            errorText.textContent = 'Username sudah dipakai, coba yang lain.';
            return;
        }

        users.push({ username: username, password: password });
        saveUsers(users);
        errorText.textContent = '';
        setCurrentUser(username);
        window.location.href = 'index.html';
    });
}

// TOMBOL LOGOUT (ADA DI NAV HALAMAN INDEX/GAME/FAVORIT)
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
