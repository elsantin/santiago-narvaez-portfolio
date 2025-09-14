// Variable global para el índice del modal
let currentIndex = 0;
let galleryItems = []; // Initialize empty array

// Translations object
const translations = {
    // Navegación
    'nav-home': ['Home', 'Inicio'],
    'nav-gallery': ['Gallery', 'Galería'],
    'nav-about': ['Profile', 'Perfil'], // Mantenemos 'Perfil' para el enlace de navegación
    'nav-contact': ['Contact', 'Contacto'],

    // Hero
    'hero-subtitle': ['Exploring the intersection of imagination<br>and artificial intelligence',
                      'Explorando la intersección entre imaginación<br>e inteligencia artificial'],
    'hero-btn': ['Discover Works', 'Ver Obras'],

    // Secciones
    'section-gallery': ['Gallery', 'Galería'],
    'section-about': ['Profile', 'Perfil'], // Título principal de la sección
    'section-contact': ['Contact', 'Contacto'],

    // Profile Content
    'about-title': ['Santiago Narváez', 'Santiago Narváez'],
    'about-p1': [
        'As a digital artist exploring the frontiers of AI-assisted creation, I blend traditional artistic sensibilities with cutting-edge technology to craft immersive visual experiences that challenge perceptions and evoke emotion.',
        'Como artista digital que explora las fronteras de la creación asistida por IA, combino sensibilidades artísticas tradicionales con tecnología de vanguardia para crear experiencias visuales inmersivas que desafían percepciones y evocan emociones.'
    ],
    'about-p2': [ // Assuming this key was intended or merge content if needed
        'I am a photographer and digital artist, specializing in capturing unique moments and transforming them into impactful visual experiences. My work explores the intersection of human imagination and artificial intelligence, creating dreamlike landscapes, surreal portraits and futuristic visions that exist in the liminal space between the real and the imagined.',
        'Soy fotógrafo y artista digital, especializado en capturar momentos únicos y transformarlos en experiencias visuales impactantes. Mi trabajo explora la intersección entre la imaginación humana y la inteligencia artificial, creando paisajes oníricos, retratos surrealistas y visiones futuristas que existen en el espacio liminal entre lo real y lo imaginado.'
    ],
    'about-p3': [
        'Drawing inspiration from both natural phenomena and digital abstractions, I strive to create pieces that feel both familiar and otherworldly, inviting viewers to question the boundaries between human creativity and technological innovation.',
        'Inspirándome tanto en fenómenos naturales como en abstracciones digitales, me esfuerzo por crear piezas que se sientan familiares y ajenas al mismo tiempo, invitando a los espectadores a cuestionar los límites entre la creatividad humana y la innovación tecnológica.'
    ],
    'about-p4': [
        'Through my portfolio, I invite you to journey through these digital realms – spaces of contemplation, wonder, and possibility that reflect our evolving relationship with technology and the expanding horizons of artistic expression.',
        'A través de mi portafolio, te invito a viajar por estos reinos digitales: espacios de contemplación, asombro y posibilidad que reflejan nuestra relación en evolución con la tecnología y los horizontes en expansión de la expresión artística.'
    ],

    // Contact
    'contact-location': ['Location', 'Ubicación'],
    'contact-email': ['Email', 'Email'],
    'contact-social': ['Social Media', 'Redes Sociales'],
    'contact-name': ['Name', 'Nombre'],
    'contact-message': ['Message', 'Mensaje'],
    'contact-send': ['Send Message', 'Enviar Mensaje'],
    'contact-placeholder-name': ['Your Name', 'Tu Nombre'],
    'contact-placeholder-email': ['Your Email', 'Tu Email'],
    'contact-subject-label': ['Subject', 'Asunto'],
    'contact-placeholder-subject': ['Subject', 'Asunto'],
    'contact-placeholder-message': ['Your Message', 'Tu Mensaje']
};

// Espera a que el contenido HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery items
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

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
            if (window.scrollY > 80) {
                nav.classList.add('nav-scrolled');
            } else {
                nav.classList.remove('nav-scrolled');
            }
        });
    }

    // --- Navegación suave para links internos ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Ensure it's a valid internal link longer than just "#"
            if (href && href.length > 0 && href.startsWith('#')) { // Allow href="#" or href="#home"
                e.preventDefault(); // Prevent default jump

                if (href === '#home' || href === '#') { // Si es el enlace a Inicio
                    window.scrollTo({
                        top: 0, // Ir al principio de todo
                        behavior: 'smooth'
                    });
                } else { // Para otros enlaces internos (#gallery, #about, #contact)
                    try {
                        const targetSection = document.querySelector(href);
                        if (targetSection) {
                            // Calcular scroll basado en el título de la sección
                            const targetTitle = targetSection.querySelector('.section-title');
                            // Usar el offset del título si existe, si no, el de la sección
                            const elementTop = targetTitle ? targetTitle.offsetTop : targetSection.offsetTop;

                            let headerOffset = 0;
                            // Calcular offset del header fijo
                            if (nav && getComputedStyle(nav).position === 'fixed') {
                                headerOffset = nav.offsetHeight;
                            }

                            // Calcular posición final: top del elemento - altura header - buffer deseado
                            // Dejamos 50px de espacio *sobre* el título (debajo del header)
                            const scrollToPosition = elementTop - headerOffset - 50; // Ajusta el -50 si quieres más/menos espacio

                            window.scrollTo({
                                top: scrollToPosition,
                                behavior: 'smooth'
                            });
                        }
                    } catch (error) {
                        // Log error if the selector is invalid
                        console.error("Error finding target or invalid selector:", href, error);
                    }
                }
            }
        });
    });


    // --- Modal de Imagen ---
    const modal = document.getElementById('imageModal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    // Elementos visibles
    const modalImg = document.getElementById('modalImg');
    const modalDetails = document.getElementById('modalDetails');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');

    // --- ELIMINADO: Referencias a elementos buffer ---
    // const modalImgBuffer = document.getElementById('modalImg_buffer');
    // const modalDetailsBuffer = document.getElementById('modalDetails_buffer');
    // const modalTitleBuffer = document.getElementById('modalTitle_buffer');
    // const modalCategoryBuffer = document.getElementById('modalCategory_buffer');
    // const modalDescriptionBuffer = document.getElementById('modalDescription_buffer');

    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // --- ELIMINADO: Función toggleFocusMode ---
    // function toggleFocusMode() { ... }

    // Función para abrir el modal (simplificada, sin buffer ni focus)
    function openModal(index) {
        // Basic checks & index wrapping
        // --- MODIFICADO: Quitar checks de buffer ---
        if (!modal || !modalContent || !modalDetails || galleryItems.length === 0) return;
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        currentIndex = index;
        const item = galleryItems[currentIndex];
        const imgElement = item.querySelector('img');
        if (!imgElement) return;

        // 1. Obtener datos
        const imgSrc = imgElement.getAttribute('src');
        const title = item.getAttribute('data-title') || '';
        const category = item.getAttribute('data-category') || '';
        const currentLang = document.documentElement.lang || 'es';
        const descriptionAttr = currentLang === 'es' ? 'data-description-es' : 'data-description';
        const description = item.getAttribute(descriptionAttr) || item.getAttribute('data-description') || '';

        // 2. Resetear estilos (layout y max-width texto)
        modalContent.classList.remove('layout-vertical');
        if (modalDetails) modalDetails.style.maxWidth = ''; // Resetear max-width

        // 3. Actualizar texto
        if (modalTitle) modalTitle.textContent = title;
        if (modalCategory) modalCategory.textContent = category;
        if (modalDescription) modalDescription.textContent = description;

        // 4. Actualizar imagen y listeners (sin buffer)
        if (modalImg) {
            modalImg.src = ''; // Vaciar src para posible mejora de transición (opcional)
            modalImg.onload = null; // Limpiar handlers anteriores
            modalImg.onerror = null;

            modalImg.onload = () => {
                 // Calcular layout y ancho de texto para horizontal
                 const isVertical = modalImg.naturalWidth / modalImg.naturalHeight < 1;
                 const isWideScreen = window.innerWidth >= 769;
                 let calculatedMaxWidth = '';

                 if (isVertical && isWideScreen) {
                     modalContent.classList.add('layout-vertical');
                     if (modalDetails) modalDetails.style.maxWidth = ''; // Resetear
                 } else {
                     modalContent.classList.remove('layout-vertical');
                     // Calcular max-width para el texto si es horizontal
                     const imageWidth = modalImg.clientWidth;
                     if (imageWidth > 0) {
                         calculatedMaxWidth = imageWidth + 'px';
                     }
                     if (modalDetails) modalDetails.style.maxWidth = calculatedMaxWidth;
                 }
            };
            modalImg.onerror = () => {
                 console.error("Failed to load modal image:", imgSrc);
                 modalContent.classList.remove('layout-vertical');
                 if (modalDetails) modalDetails.style.maxWidth = ''; // Resetear en caso de error
            };

            modalImg.setAttribute('src', imgSrc); // Asignar nueva fuente

            // --- ELIMINADO: Listener de doble clic ---
            // modalImg.removeEventListener('dblclick', toggleFocusMode);
        }

        // 5. Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to close the modal (simplificada)
    function closeModal() {
        if (!modal || !modalContent || !modalDetails) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (modalImg) {
            modalImg.src = ''; // Vaciar src al cerrar
        }
        modalContent.classList.remove('layout-vertical');
        if(modalDetails) modalDetails.style.maxWidth = ''; // Resetear max-width
        // --- ELIMINADO: Quitar clases focus ---
        // modalContent.classList.remove('focus-mode');
        // modal.classList.remove('modal-focus-active');
    }


    // Event Listeners for gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    // Modal controls (sin checks de focus mode)
    if (modal) {
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
             // Cerrar si se hace clic fuera
             if (e.target === modal) {
                  closeModal();
             }
        });
        if (prevBtn) {
             prevBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 openModal(currentIndex - 1); // Siempre funciona
             });
        }
        if (nextBtn) {
             nextBtn.addEventListener('click', (e) => {
                 e.stopPropagation();
                 openModal(currentIndex + 1); // Siempre funciona
             });
        }
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            // Navegación con flechas siempre activa
            switch (e.key) {
                case 'ArrowLeft': openModal(currentIndex - 1); break;
                case 'ArrowRight': openModal(currentIndex + 1); break;
                case 'Escape': closeModal(); break; // Escape siempre cierra
            }
        });
    }

    // --- Contact Form Handling ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim()) {
                if(submitButton) submitButton.disabled = true;
                alert('Thank you for your message. I will get back to you soon!'); // Placeholder
                contactForm.reset();
                if(submitButton) submitButton.disabled = false;
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }

    // --- Language Toggle ---
    const languageToggle = document.getElementById('languageToggle');
    let currentLang = localStorage.getItem('language') || 'es';
    function updateLanguage(lang) {
        if (!lang || (lang !== 'en' && lang !== 'es')) lang = 'es';
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        const targetIndex = lang === 'es' ? 1 : 0;
        Object.keys(translations).forEach(key => {
            const elements = document.querySelectorAll(`[data-translate="${key}"]`);
            elements.forEach(el => {
                if (translations[key] && typeof translations[key][targetIndex] !== 'undefined') {
                    el.innerHTML = translations[key][targetIndex];
                } else { console.warn(`Translation missing for key "${key}" in language "${lang}"`); }
            });
        });
        document.querySelectorAll('[data-translate-attr]').forEach(el => {
            const attrName = el.getAttribute('data-translate-attr');
            const translationKey = el.getAttribute('data-translate');
            if (attrName && translationKey && translations[translationKey] && typeof translations[translationKey][targetIndex] !== 'undefined') {
                el.setAttribute(attrName, translations[translationKey][targetIndex]);
            } else { console.warn(`Attribute translation missing for key "${translationKey}" in language "${lang}"`); }
        });
        if (languageToggle) languageToggle.textContent = lang === 'es' ? 'EN' : 'ES';
        // Actualizar modal si está abierto (usará la nueva lógica de openModal)
        if (modal && modal.classList.contains('active')) {
             openModal(currentIndex);
        }
    }
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            currentLang = currentLang === 'en' ? 'es' : 'en';
            updateLanguage(currentLang);
        });
        // Set initial language on page load
        updateLanguage(currentLang);
    } else {
         // Fallback or default language setup if toggle doesn't exist
         updateLanguage('es'); // Or 'en' based on preference
    }
});
