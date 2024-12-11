document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.getElementById('profile-link');
    const searchLink = document.getElementById('search-link');
    const logoutLink = document.getElementById('logout-link');
    const usernameDisplay = document.getElementById('username-display');
    const postsContainer = document.getElementById('posts');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');


    function showLoggedInUI() {
        const user = JSON.parse(localStorage.getItem('user'));
        usernameDisplay.textContent = ` (${user.username})`;
        profileLink.style.display = 'inline';
        searchLink.style.display = 'inline';
        logoutLink.style.display = 'inline';
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
    }

    function showAuthForms() {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        profileLink.style.display = 'none';
        searchLink.style.display = 'none';
        logoutLink.style.display = 'none';
        usernameDisplay.textContent = '';
    }


    function handleLogout() {
        localStorage.removeItem('user');
        showAuthForms();
        window.location.reload(true); // Полное обновление страницы
    }

    logoutLink.addEventListener('click', handleLogout);

    const user = localStorage.getItem('user');
    if (user) {
        showLoggedInUI();
    } else {
        showAuthForms();
    }

    

    function redirectIfNotLoggedIn() {
        const user = localStorage.getItem('user');
        if (!user && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
        }
    }

    redirectIfNotLoggedIn();
});


