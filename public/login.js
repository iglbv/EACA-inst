document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3001/users')
        .then(response => response.json())
        .then(users => {
            const user = users.find(user => user.username === username && user.password === password);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/'; // Перенаправление на главную после успешного входа
            } else {
                alert('Неверный логин или пароль');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('Ошибка входа: ' + error.message);
        });
});
