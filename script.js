// Variable global para el índice del modal
let currentIndex = 0; 

// Espera a que el contenido HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad del botón Back to Top ---
    // ... (código sin cambios) ...
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) { /* ... listeners ... */ }

    // --- Efecto de navegación en scroll ---
    // ... (código sin cambios) ...
    const nav = document.querySelector('.nav-container');
    if (nav) { /* ... listener ... */ }

    // --- Navegación suave para links internos (anclas #) ---
     // ... (código sin cambios) ...
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { /* ... listener ... */ });

    // --- Funcionalidad del modal de imagen ---
     // ... (código sin cambios, incluyendo openModal y listeners) ...
    const modal = document.getElementById('imageModal');
    // ... (resto de variables y código del modal) ...
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    function openModal(index) { /* ... código de openModal sin cambios ... */ }
    galleryItems.forEach((item, index) => { item.addEventListener('click', function() { openModal(index); }); });
    if (modal) { /* ... listeners del modal sin cambios ... */ }


    // --- Manejo de envío de formulario con AJAX y Feedback Mejorado ---
    const contactForm = document.querySelector('.contact-form');
    const formStatusMessage = document.getElementById('form-status-message'); 

    if (contactForm && formStatusMessage) { 
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir siempre para AJAX

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('.form-button'); 
            const formData = new FormData(contactForm); 

            // Limpiar estado previo
            formStatusMessage.classList.remove('visible', 'success', 'error');
            formStatusMessage.textContent = ''; 
            if(nameInput) nameInput.classList.remove('invalid'); 
            if(emailInput) emailInput.classList.remove('invalid');
            if(messageInput) messageInput.classList.remove('invalid');

            // Validación (igual que antes)
            let isValid = true;
            let errorMessage = 'Por favor, completa todos los campos requeridos.'; 
            const currentLang = document.documentElement.lang || 'es'; 
            if (currentLang === 'en') { errorMessage = 'Please fill in all required fields.'; }
            if (!nameInput || nameInput.value.trim() === '') { isValid = false; if(nameInput) nameInput.classList.add('invalid'); }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            if (!emailInput || emailInput.value.trim() === '' || !emailRegex.test(emailInput.value)) { 
                isValid = false;
                if(emailInput) emailInput.classList.add('invalid');
                if (emailInput && emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
                    errorMessage = currentLang === 'es' ? 'Por favor, introduce un correo electrónico válido.' : 'Please enter a valid email address.';
                }
            }
            if (!messageInput || messageInput.value.trim() === '') { isValid = false; if(messageInput) messageInput.classList.add('invalid'); }

            // Si NO es válido, mostrar error y detener
            if (!isValid) {
                formStatusMessage.textContent = errorMessage;
                formStatusMessage.classList.add('error', 'visible'); 
                setTimeout(() => { formStatusMessage.classList.remove('visible'); setTimeout(() => { formStatusMessage.classList.remove('error'); formStatusMessage.textContent = ''; }, 400); }, 5000); 
                return; 
            }

            // --- Si es válido, ENVIAR CON AJAX (Lógica de respuesta SIMPLIFICADA) ---
            let originalButtonText = 'Send Message'; 
            if(submitButton) {
                 const originalButtonTextKey = submitButton.getAttribute('data-translate');
                 originalButtonText = translations[originalButtonTextKey] ? translations[originalButtonTextKey][currentLang === 'es' ? 1 : 0] : submitButton.textContent; 
                 const sendingText = currentLang === 'es' ? 'Enviando...' : 'Sending...'; 
                 submitButton.textContent = sendingText; 
                 submitButton.disabled = true; 
                 formStatusMessage.textContent = ''; 
                 formStatusMessage.classList.remove('visible', 'success', 'error');
            }

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json' // Aún pedimos JSON por si acaso
                }
            })
            .then(response => {
                // *** LÓGICA SIMPLIFICADA ***
                if (response.ok) {
                    // Si la respuesta HTTP es exitosa (200-299), asumimos éxito directamente.
                    return Promise.resolve({ success: true }); // Resolvemos para pasar al siguiente .then
                } else {
                    // Si la respuesta HTTP indica error (4xx, 5xx), lanzamos un error para ir al .catch
                    throw new Error(`Error HTTP: ${response.status}`);
                }
            })
            .then(data => {
                // Este bloque se ejecuta si el .then anterior resolvió exitosamente
                console.log('Fetch resolved successfully.'); 
                const successText = currentLang === 'es' ? '¡Mensaje enviado con éxito!' : 'Message sent successfully!';
                formStatusMessage.textContent = successText;
                formStatusMessage.classList.remove('error');
                formStatusMessage.classList.add('success', 'visible'); 
                contactForm.reset(); 

                 setTimeout(() => { // Ocultar mensaje éxito
                    formStatusMessage.classList.remove('visible');
                    setTimeout(() => {
                         formStatusMessage.classList.remove('success');
                         formStatusMessage.textContent = '';
                    }, 400);
                }, 4000); 

            })
            .catch(error => {
                // Captura errores de red O el error lanzado desde el bloque !response.ok
                console.error('Fetch failed or server returned error:', error);
                const errorText = currentLang === 'es' ? 'Error al enviar el mensaje. Intenta de nuevo más tarde.' : 'Error sending message. Please try again later.';
                formStatusMessage.textContent = errorText;
                formStatusMessage.classList.remove('success');
                formStatusMessage.classList.add('error', 'visible');

                 setTimeout(() => { // Ocultar mensaje error
                    formStatusMessage.classList.remove('visible');
                    setTimeout(() => {
                         formStatusMessage.classList.remove('error');
                         formStatusMessage.textContent = '';
                    }, 400); 
                }, 6000); 

            })
            .finally(() => {
                // Se ejecuta siempre al final
                if(submitButton) {
                    submitButton.textContent = originalButtonText; 
                    submitButton.disabled = false; 
                }
            });
            // --- Fin Envío con AJAX ---
        });
    }

    // --- Inicialización del Idioma ---
    const languageToggle = document.getElementById('languageToggle');
    let pageCurrentLang = localStorage.getItem('language') || 'es'; 
    if (languageToggle) { /* ... listener e inicialización ... */ } 
    else { updateLanguage(pageCurrentLang, null); }

}); // Fin DOMContentLoaded principal


// --- Funcionalidad de cambio de idioma ---
const translations = { /* ... Tu objeto translations ... */ };
function updateLanguage(lang, languageToggle) { /* ... Tu función updateLanguage sin cambios ... */ }