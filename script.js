// Variable global para el índice del modal (necesaria para actualizar descripción al cambiar idioma)
let currentIndex = 0; // Asegúrate que esté definida globalmente si la usas fuera de DOMContentLoaded

// Espera a que el contenido HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {

    // --- Funcionalidad del botón Back to Top ---
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) { 
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }

    // --- Efecto de navegación en scroll ---
    const nav = document.querySelector('.nav-container');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { 
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
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
                        window.scrollTo({
                            top: offsetTop - headerOffset, 
                            behavior: 'smooth'
                        });
                    }
                } catch (error) {
                    console.error("Error finding target for smooth scroll:", href, error);
                }
            }
        });
    });

    // --- Funcionalidad del modal de imagen ---
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    
    function openModal(index) {
        if (!modal || galleryItems.length === 0) return; 

        if (index < 0) index = galleryItems.length - 1; 
        if (index >= galleryItems.length) index = 0; 

        currentIndex = index; 
        const item = galleryItems[currentIndex];
        const imgElement = item.querySelector('img');
        if (!imgElement) return; 

        const imgSrc = imgElement.getAttribute('src');
        const title = item.getAttribute('data-title') || '';
        const category = item.getAttribute('data-category') || '';
        const currentLang = document.documentElement.lang || 'es';
        const descriptionAttr = currentLang === 'es' ? 'data-description-es' : 'data-description';
        let description = item.getAttribute(descriptionAttr) || item.getAttribute('data-description') || ''; 

        if(modalImg) modalImg.setAttribute('src', imgSrc);
        if(modalTitle) modalTitle.textContent = title;
        if(modalCategory) modalCategory.textContent = category;
        if(modalDescription) modalDescription.textContent = description; 

        const tempImg = new Image();
        tempImg.onload = function() {
            const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                 if (aspectRatio < 1) { 
                     modalContent.classList.add('vertical');
                 } else {
                     modalContent.classList.remove('vertical');
                 }
            }
        };
        tempImg.onerror = function() { console.error("Error loading image:", imgSrc); };
        tempImg.src = imgSrc; 

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() { openModal(index); });
    });

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


    // --- Manejo de envío de formulario con Feedback Mejorado ---
    const contactForm = document.querySelector('.contact-form');
    const formStatusMessage = document.getElementById('form-status-message'); // Obtener el div de mensajes

    if (contactForm && formStatusMessage) { // Asegurarse que ambos elementos existan
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevenir envío real

            // Referencias a inputs y botón
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('.form-button');

            // Ocultar mensaje previo y quitar clases de error/éxito
            formStatusMessage.classList.remove('visible', 'success', 'error');
            formStatusMessage.textContent = ''; // Limpiar texto
            // Limpiar posible clase de error de inputs
            if(nameInput) nameInput.classList.remove('invalid'); 
            if(emailInput) emailInput.classList.remove('invalid');
            if(messageInput) messageInput.classList.remove('invalid');

            // Validación simple
            let isValid = true;
            let errorMessage = 'Por favor, completa todos los campos requeridos.'; // Mensaje de error genérico (se actualizará si es necesario)
            const currentLang = document.documentElement.lang || 'es'; // Obtener idioma actual para mensajes
            if (currentLang === 'en') {
                 errorMessage = 'Please fill in all required fields.';
            }


            if (!nameInput || nameInput.value.trim() === '') {
                isValid = false;
                if(nameInput) nameInput.classList.add('invalid');
            }
            // Validación de formato de email simple
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
            if (!emailInput || emailInput.value.trim() === '' || !emailRegex.test(emailInput.value)) { 
                isValid = false;
                if(emailInput) emailInput.classList.add('invalid');
                // Mensaje de error más específico para email inválido
                if (emailInput && emailInput.value.trim() !== '' && !emailRegex.test(emailInput.value)) {
                    errorMessage = currentLang === 'es' ? 'Por favor, introduce un correo electrónico válido.' : 'Please enter a valid email address.';
                }
            }
            if (!messageInput || messageInput.value.trim() === '') {
                isValid = false;
                if(messageInput) messageInput.classList.add('invalid');
            }

            // Si NO es válido, mostrar mensaje de error
            if (!isValid) {
                formStatusMessage.textContent = errorMessage;
                formStatusMessage.classList.add('error', 'visible'); // Añadir clase error y visible
                // Opcional: esconder el mensaje de error después de unos segundos
                setTimeout(() => {
                    formStatusMessage.classList.remove('visible'); 
                    // Esperar a que termine la transición de opacidad antes de quitar la clase de error y limpiar texto
                    setTimeout(() => { 
                         formStatusMessage.classList.remove('error');
                         formStatusMessage.textContent = '';
                    }, 400); // Debe coincidir con la duración de la transición CSS (0.4s)
                }, 5000); // Ocultar después de 5 segundos
                return; // Detener ejecución si no es válido
            }

            // --- Si es válido, simular envío ---
            if(submitButton) {
                // Guardar texto original basado en el atributo data-translate
                const originalButtonTextKey = submitButton.getAttribute('data-translate');
                const originalButtonText = translations[originalButtonTextKey] ? translations[originalButtonTextKey][currentLang === 'es' ? 1 : 0] : 'Send Message';
                
                const sendingText = currentLang === 'es' ? 'Enviando...' : 'Sending...'; 
                submitButton.textContent = sendingText; 
                submitButton.disabled = true; 

                // Simular espera de red
                setTimeout(() => {
                    // Mostrar mensaje de éxito
                    const successText = currentLang === 'es' ? '¡Mensaje enviado con éxito!' : 'Message sent successfully!';
                    formStatusMessage.textContent = successText;
                    formStatusMessage.classList.remove('error'); // Asegurar que no tenga la clase error
                    formStatusMessage.classList.add('success', 'visible'); // Añadir clase success y visible
                    
                    contactForm.reset(); // Limpiar formulario

                    // Restaurar botón después de un breve delay para que se vea el mensaje
                    setTimeout(() => {
                         if(submitButton) {
                            submitButton.textContent = originalButtonText;
                            submitButton.disabled = false;
                         }
                         // Opcional: Ocultar mensaje de éxito después de más tiempo
                         formStatusMessage.classList.remove('visible');
                         setTimeout(() => {
                              formStatusMessage.classList.remove('success');
                              formStatusMessage.textContent = '';
                         }, 400); // Esperar transición
                    }, 3000); // Ocultar/Restaurar después de 3s

                }, 1500); // Simular 1.5 segundos de espera de red
            }
            // --- Fin Simulación ---
        });
    }

    // --- Inicialización del Idioma (Movido aquí para asegurar que todo el DOM esté listo) ---
    const languageToggle = document.getElementById('languageToggle');
    let pageCurrentLang = localStorage.getItem('language') || 'es'; // Obtener idioma guardado o usar 'es'
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const newLang = pageCurrentLang === 'en' ? 'es' : 'en';
            pageCurrentLang = newLang; 
            updateLanguage(newLang, languageToggle); 
        });
        // Inicializar idioma al cargar
        updateLanguage(pageCurrentLang, languageToggle); 
    } else {
        // Si no hay botón, igual inicializar textos por si acaso
         updateLanguage(pageCurrentLang, null);
    }

}); // Fin DOMContentLoaded principal


// --- Funcionalidad de cambio de idioma (Definición fuera de DOMContentLoaded para ser llamada) ---
const translations = {
    // ... (Tu objeto translations existente sin cambios) ...
     'nav-home': ['Home', 'Inicio'],
     'nav-gallery': ['Gallery', 'Galería'],
     'nav-about': ['Profile', 'Perfil'],
     'nav-contact': ['Contact', 'Contacto'],
     'hero-subtitle': [
         'Exploring the intersection of imagination<br>and artificial intelligence', 
         'Explorando la intersección entre imaginación<br>e inteligencia artificial' 
     ],
     'hero-btn': ['Discover Works', 'Ver Obras'],
     'section-gallery': ['Gallery', 'Galería'],
     'section-about': ['Profile', 'Perfil'],
     'section-contact': ['Contact', 'Contacto'],
     'about-title': ['Santiago Narváez', 'Santiago Narváez'],
     'about-p1': [
          'As a photographer and visual creator, I explore the frontiers of AI-assisted creation, blending traditional artistic sensibilities with cutting-edge technology to transform unique moments into impactful visual experiences. My work delves into the intersection of human imagination and artificial intelligence, crafting dreamlike landscapes, surreal portraits, and futuristic visions in the liminal space between the real and the imagined.',
          'Como fotógrafo y creador visual, exploro las fronteras de la creación asistida por IA, combinando sensibilidades artísticas tradicionales con tecnología de vanguardia para transformar momentos únicos en experiencias visuales impactantes. Mi trabajo explora la intersección entre la imaginación humana y la inteligencia artificial, creando paisajes oníricos, retratos surrealistas y visiones futuristas en el espacio liminal entre lo real y lo imaginado.'
     ],
      'about-p3': [
          'Drawing inspiration from both natural phenomena and digital abstractions, I strive to create pieces that feel both familiar and otherworldly, inviting viewers to question the boundaries between human creativity and technological innovation.',
          'Inspirándome en fenómenos naturales y abstracciones digitales, me esfuerzo por crear piezas familiares y ajenas, invitando a cuestionar los límites entre creatividad humana e innovación tecnológica.'
     ],
      'about-p4': [
          'Through my portfolio, I invite you to journey through these digital realms – spaces of contemplation, wonder, and possibility that reflect our evolving relationship with technology and the expanding horizons of artistic expression.',
          'A través de mi portafolio, te invito a viajar por estos reinos digitales: espacios de contemplación, asombro y posibilidad que reflejan nuestra relación en evolución con la tecnología y los horizontes en expansión de la expresión artística.'
     ],
     'contact-location': ['Location', 'Ubicación'],
     'contact-email': ['Email', 'Correo Electrónico'],
     'contact-social': ['Social Media', 'Redes Sociales'],
     'contact-name': ['Name', 'Nombre'],
     'contact-placeholder-name': ['Your Name', 'Tu Nombre'],
     'contact-email-label': ['Email', 'Correo Electrónico'],
     'contact-placeholder-email': ['Your Email', 'Tu Correo Electrónico'],
     'contact-subject': ['Subject', 'Asunto'],
     'contact-placeholder-subject': ['Subject', 'Asunto'],
     'contact-message': ['Message', 'Mensaje'],
     'contact-placeholder-message': ['Your Message', 'Tu Mensaje'],
     'contact-send': ['Send Message', 'Enviar Mensaje']
};

function updateLanguage(lang, languageToggle) {
    localStorage.setItem('language', lang); 
    document.documentElement.lang = lang; 

    Object.keys(translations).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(el => {
            const index = lang === 'es' ? 1 : 0;
            const translation = translations[key] ? translations[key][index] : null;
             if (translation !== null) {
                 if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder !== undefined) {
                     // Actualizar placeholder solo si data-translate coincide con la clave Y el elemento es un placeholder
                     if (el.hasAttribute('data-translate') && key === el.getAttribute('data-translate') && key.includes('placeholder')) {
                         el.placeholder = translation;
                     }
                     // Actualizar label si data-translate coincide con la clave Y el elemento es un label (o tiene for)
                     else if (el.tagName === 'LABEL' && el.hasAttribute('data-translate') && key === el.getAttribute('data-translate')) {
                          el.textContent = translation; // Usar textContent para labels
                     }
                 } else if (el.tagName === 'BUTTON' && el.hasAttribute('data-translate') && key === el.getAttribute('data-translate')) {
                     // Actualizar texto de botones
                     el.textContent = translation;
                 }
                 
                 else {
                     // Actualizar contenido para otros elementos si data-translate coincide
                     if (el.hasAttribute('data-translate') && key === el.getAttribute('data-translate')) {
                         el.innerHTML = translation; // Usar innerHTML para p, h4, etc. que pueden tener <br>
                     }
                 }
             }
        });
    });

    document.querySelectorAll('[data-translate-lang]').forEach(el => {
        if (el.getAttribute('data-translate-lang') === lang) {
            el.style.display = ''; 
        } else {
            el.style.display = 'none'; 
        }
    });

    if (languageToggle) {
        languageToggle.textContent = lang === 'es' ? 'EN' : 'ES';
    }

    // Actualizar descripción del modal si está activo
    const modal = document.getElementById('imageModal'); 
    const modalDescElement = document.getElementById('modalDescription');
    const activeGalleryItem = document.querySelector(`.gallery-item[data-index="${currentIndex}"]`); 
    if (modal && modalDescElement && activeGalleryItem && modal.classList.contains('active')) {
         const descriptionAttr = lang === 'es' ? 'data-description-es' : 'data-description';
         let description = activeGalleryItem.getAttribute(descriptionAttr) || activeGalleryItem.getAttribute('data-description') || '';
         modalDescElement.textContent = description;
    }
}

