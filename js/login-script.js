document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // Credenciales simuladas (¡No usar en producción! Esto es solo para la demo)
    const CORRECT_USERNAME = 'admin';
    const CORRECT_PASSWORD = '123';

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Detener el envío por defecto

        // 1. Validar campos vacíos (validación de Bootstrap)
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add('was-validated');
            errorMessage.classList.add('d-none'); // Ocultar mensaje de error general
            return;
        }

        form.classList.add('was-validated');

        // 2. Obtener valores y simular el inicio de sesión
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
            // Éxito en el login: Redirigir al panel de control (index.html)
            errorMessage.classList.add('d-none');
            alert('¡Inicio de sesión exitoso!');
            window.location.href = 'menu.html'; // Redirige a la página principal
        } else {
            // Fallo en el login: Mostrar mensaje de error
            errorMessage.classList.remove('d-none');
        }
    });

    // Ocultar mensaje de error si el usuario intenta corregir los campos
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            errorMessage.classList.add('d-none');
        });
    });
});