document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Регистрация успешна! Теперь вы можете войти.');
            window.location.href = '/login'; // Перенаправление на страницу входа
        })
        .catch(error => {
            console.error('Registration error:', error);
            alert('Ошибка регистрации: ' + error.message);
        });
});
