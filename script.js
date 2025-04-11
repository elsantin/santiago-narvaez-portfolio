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

    // --- Funcionalidad del modal de imagen (CÓDIGO VERIFICADO Y COMPLETO) ---
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item')); // Asegúrate que esto selecciona tus items
    
    // Función para abrir el modal (Verificada)
    function openModal(index) { 
        if (!modal || galleryItems.length === 0) return; 

        // Lógica de navegación circular
        if (index < 0) index = galleryItems.length - 1; 
        if (index >= galleryItems.length) index = 0; 

        currentIndex = index; // Actualiza índice global
        const item = galleryItems[currentIndex];
        const imgElement = item.querySelector('img');
        if (!imgElement) return; 

        // Obtener datos del item
        const imgSrc = imgElement.getAttribute('src');
        const title = item.getAttribute('data-title') || '';
        const category = item.getAttribute('data-category') || '';
        const currentLang = document.documentElement.lang || 'es';
        const descriptionAttr = currentLang === 'es' ? 'data-description-es' : 'data-description';
        let description = item.getAttribute(descriptionAttr) || item.getAttribute('data-description') || ''; 

        // Actualizar contenido del modal
        if(modalImg) modalImg.setAttribute('src', imgSrc);
        if(modalTitle) modalTitle.textContent = title;
        if(modalCategory) modalCategory.textContent = category;
        if(modalDescription) modalDescription.textContent = description; 

        // Comprobar orientación (Verificado)
        const tempImg = new Image();
        tempImg.onload = function() {
            const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                 if (aspectRatio < 1) { modalContent.classList.add('vertical'); } 
                 else { modalContent.classList.remove('vertical'); }
            }
        };
        tempImg.onerror = function() { console.error("Error loading image for aspect ratio check:", imgSrc); };
        tempImg.src = imgSrc; 

        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    // Añadir listeners a los items de la galería (Verificado)
    galleryItems.forEach((item, index) => { 
        item.addEventListener('click', function() { openModal(index); }); 
    });

    // Añadir listeners a los botones del modal y teclado (Verificado)
    if (modal) { 
       if(closeBtn) { 
           closeBtn.addEventListener('click', function() { 
               modal.classList.remove('active'); 
               document.body.style.overflow = 'auto'; 
           }); 
       }
       modal.addEventListener('click', function(e) { 
           if (e.target === modal) { 
               modal.classList.remove('active'); 
               document.body.style.overflow = 'auto'; 
           } 
       });
       if(prevBtn) { 
           prevBtn.addEventListener('click', function() { openModal(currentIndex - 1); }); 
       }
       if(nextBtn) { 
           nextBtn.addEventListener('click', function() { openModal(currentIndex + 1); }); 
       }
       document.addEventListener('keydown', function(e) { 
           if (!modal.classList.contains('active')) return; 
           if (e.key === 'ArrowLeft') { openModal(currentIndex - 1); } 
           else if (e.key === 'ArrowRight') { openModal(currentIndex + 1); } 
           else if (e.key === 'Escape') { 
               modal.classList.remove('active'); 
               document.body.style.overflow = 'auto'; 
           } 
       });
    } 
    // --- Fin Funcionalidad del modal de imagen ---


    // --- Manejo de envío de formulario con AJAX y Feedback Mejorado (Verificado) ---
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
                    'Accept': 'application/json' 
                }
            })
            .then(response => {
                // Comprobar si la respuesta HTTP fue exitosa (status 2xx)
                if (response.ok) {
                    console.log('FormSubmit request successful (response.ok)');
                    return Promise.resolve({ success: true }); // Asumir éxito
                } else {
                    // Si la respuesta HTTP indica error (4xx, 5xx)
                    throw new Error(`Error HTTP: ${response.status}`); // Lanzar error genérico
                }
            })
            .then(data => {
                // Se ejecuta si el .then anterior resolvió exitosamente
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
                // Captura errores de red O el error lanzado desde el bloque !response.ok
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
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const newLang = pageCurrentLang === 'en' ? 'es' : 'en';
            pageCurrentLang = newLang; 
            updateLanguage(newLang, languageToggle); 
        });
        updateLanguage(pageCurrentLang, languageToggle); 
    } else {
         updateLanguage(pageCurrentLang, null);
    }

}); // Fin DOMContentLoaded principal


// --- Funcionalidad de cambio de idioma ---
const translations = { /* ... Tu objeto translations ... */ };
function updateLanguage(lang, languageToggle) { /* ... Tu función updateLanguage sin cambios ... */ }