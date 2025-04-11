// Variable global para el índice del modal
let currentIndex = 0; 

// Espera a que el contenido HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad del botón Back to Top ---
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) { backToTopBtn.classList.add('visible'); } 
            else { backToTopBtn.classList.remove('visible'); }
        });
    }

    // --- Efecto de navegación en scroll ---
    const nav = document.querySelector('.nav-container');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { nav.classList.add('nav-scrolled'); } 
            else { nav.classList.remove('nav-scrolled'); }
        });
    }

    // --- Navegación suave para links internos (anclas #) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                try {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault(); 
                        const offsetTop = target.offsetTop;
                        let headerOffset = 0;
                        if (nav && getComputedStyle(nav).position === 'fixed') {
                            headerOffset = nav.offsetHeight;
                        }
                        window.scrollTo({ top: offsetTop - headerOffset, behavior: 'smooth' });
                    }
                } catch (error) { console.error("Error finding target:", href, error); }
            }
        });
    });

    // --- Funcionalidad del modal de imagen ---
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

            // --- Si es válido, ENVIAR CON AJAX (Lógica de respuesta mejorada) ---
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
                    'Accept': 'application/json' // Aún pedimos JSON por si acaso lo devuelve
                }
            })
            .then(response => {
                // *** CAMBIO CLAVE: Comprobar si la respuesta HTTP fue exitosa (status 2xx) ***
                if (response.ok) {
                    console.log('FormSubmit request successful (response.ok)');
                    // Si fue exitosa, asumimos que FormSubmit recibió los datos. 
                    // No necesitamos procesar el cuerpo de la respuesta necesariamente.
                    return { success: true }; // Devolvemos un objeto indicando éxito
                } else {
                    // Si la respuesta HTTP indica un error (4xx, 5xx)
                    // Intentamos leer el cuerpo por si FormSubmit da un error JSON específico
                    return response.json().then(data => { 
                        // Si hay JSON con mensaje de error, lo lanzamos
                        throw new Error(data.message || `Error del servidor: ${response.status}`); 
                    }).catch(() => {
                         // Si no hay JSON o falla el parseo, lanzamos error genérico HTTP
                         throw new Error(`Error HTTP: ${response.status}`);
                    });
                }
            })
            .then(data => {
                // Si el .then anterior devolvió { success: true } (porque response.ok era true)
                console.log('Processing success...'); 
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
                // Captura errores de red o los errores lanzados desde el bloque !response.ok
                console.error('Error submitting form:', error);
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
                // Esto se ejecuta siempre, haya éxito o error
                if(submitButton) {
                    submitButton.textContent = originalButtonText; 
                    submitButton.disabled = false; 
                }
            });
            // --- Fin Envío con AJAX ---
        });
    }

    // --- Inicialización del Idioma ---
    // ... (código sin cambios) ...
    const languageToggle = document.getElementById('languageToggle');
    let pageCurrentLang = localStorage.getItem('language') || 'es'; 
    if (languageToggle) { /* ... listener e inicialización ... */ } 
    else { updateLanguage(pageCurrentLang, null); }

}); // Fin DOMContentLoaded principal


// --- Funcionalidad de cambio de idioma ---
// ... (Definición de 'translations' y 'updateLanguage' sin cambios) ...
const translations = { /* ... Tu objeto translations ... */ };
function updateLanguage(lang, languageToggle) { /* ... Tu función updateLanguage sin cambios ... */ }