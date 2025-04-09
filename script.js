document.addEventListener('DOMContentLoaded', function() {
            // Funcionalidad del botón Back to Top
            const backToTopBtn = document.getElementById('backToTop');
            
            // Función para hacer scroll hasta arriba
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Mostrar/ocultar botón según posición de scroll
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            // Efecto de navegación en scroll
            const nav = document.querySelector('.nav-container');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    nav.classList.add('nav-scrolled');
                } else {
                    nav.classList.remove('nav-scrolled');
                }
            });
            
            // Navegación suave para links internos
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const target = document.querySelector(this.getAttribute('href'));
                    
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Funcionalidad del modal de imagen
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImg');
            const modalTitle = document.getElementById('modalTitle');
            const modalCategory = document.getElementById('modalCategory');
            const modalDescription = document.getElementById('modalDescription');
            const closeBtn = document.querySelector('.modal-close');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            // Obtener todas las imágenes de la galería
            const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
            let currentIndex = 0;
            
            // Función para abrir el modal con una imagen específica
            function openModal(index) {
                if (index < 0) index = galleryItems.length - 1;
                if (index >= galleryItems.length) index = 0;
                
                currentIndex = index;
                const item = galleryItems[index];
                
                const imgSrc = item.querySelector('img').getAttribute('src');
                const title = item.getAttribute('data-title');
                const category = item.getAttribute('data-category');
                let description = item.getAttribute('data-description');
                if (document.documentElement.lang === 'es') {
                    description = item.getAttribute('data-description-es') || description;
                }
                
                modalImg.setAttribute('src', imgSrc);
                modalTitle.textContent = title;
                modalCategory.textContent = category;
                modalDescription.textContent = description;

                // Detectar imágenes verticales
                const tempImg = new Image();
                tempImg.onload = function() {
                    const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                    const modalContent = modal.querySelector('.modal-content');
                    if (aspectRatio < 1) {
                        modalContent.classList.add('vertical');
                    } else {
                        modalContent.classList.remove('vertical');
                    }
                };

                tempImg.src = imgSrc;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            
            // Eventos de clic para elementos de la galería
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', function() {
                    openModal(index);
                });
            });
            
            // Eventos del modal
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
            
            prevBtn.addEventListener('click', function() {
                openModal(currentIndex - 1);
            });
            
            nextBtn.addEventListener('click', function() {
                openModal(currentIndex + 1);
            });
            
            // Navegación con teclado
            document.addEventListener('keydown', function(e) {
                if (!modal.classList.contains('active')) return;
                
                if (e.key === 'ArrowLeft') {
                    openModal(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    openModal(currentIndex + 1);
                } else if (e.key === 'Escape') {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Prevenir menú contextual en imágenes
            document.addEventListener('contextmenu', function(e) {
                if (e.target.nodeName === 'IMG') {
                    e.preventDefault();
                    return false;
                }
            });
            
            // Manejo de envío de formulario
            const contactForm = document.querySelector('.contact-form');
            
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const nameInput = document.getElementById('name');
                    const emailInput = document.getElementById('email');
                    const subjectInput = document.getElementById('subject');
                    const messageInput = document.getElementById('message');
                    
                    // Validación simple
                    if (nameInput.value && emailInput.value && messageInput.value) {
                        // En una aplicación real, esto enviaría datos a un servidor
                        alert('Thank you for your message. I will get back to you soon!');
                        
                        // Reiniciar formulario
                        contactForm.reset();
                    } else {
                        alert('Please fill in all required fields.');
                    }
                });
            }
        });

        // Funcionalidad de cambio de idioma
        const translations = {
            // Navegación
            'nav-home': ['Home', 'Inicio'],
            'nav-gallery': ['Gallery', 'Galería'],
            'nav-about': ['About', 'Sobre Mí'],
            'nav-contact': ['Contact', 'Contacto'],
            
            // Hero
            'hero-title': ['Digital Realms', 'Reinos Digitales'],
            'hero-subtitle': ['Exploring the intersection of imagination<br>and artificial intelligence',
                             'Explorando la intersección entre imaginación<br>e inteligencia artificial'],
            'hero-btn': ['Discover Works', 'Ver Obras'],
            
            // Secciones
            'section-featured': ['Featured Works', 'Trabajos Destacados'],
            'section-gallery': ['Gallery', 'Galería'],
            'section-about': ['About', 'Acerca de Mí'],
            'section-contact': ['Contact', 'Contacto'],
            
            // About
            'about-title': ['Santiago Narváez', 'Santiago Narváez'],
            'about-p1': [
                'As a photographer and visual creator, I explore the frontiers of AI-assisted creation, blending traditional artistic sensibilities with cutting-edge technology to transform unique moments into impactful visual experiences. My work delves into the intersection of human imagination and artificial intelligence, crafting dreamlike landscapes, surreal portraits, and futuristic visions in the liminal space between the real and the imagined.',
                'Como fotógrafo y creador visual, exploro las fronteras de la creación asistida por IA, combinando sensibilidades artísticas tradicionales con tecnología de vanguardia para transformar momentos únicos en experiencias visuales impactantes. Mi trabajo explora la intersección entre la imaginación humana y la inteligencia artificial, creando paisajes oníricos, retratos surrealistas y visiones futuristas en el espacio liminal entre lo real y lo imaginado.'
            ],
            'about-p2': [
                'As a photographer and visual creator, I explore the frontiers of AI-assisted creation, blending traditional artistic sensibilities with cutting-edge technology to transform unique moments into impactful visual experiences. My work delves into the intersection of human imagination and artificial intelligence, crafting dreamlike landscapes, surreal portraits, and futuristic visions in the liminal space between the real and the imagined.',
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
            
            // Contacto
            'contact-location': ['Location', 'Ubicación'],
            'contact-email': ['Email', 'Correo Electrónico'],
            'contact-social': ['Social Media', 'Redes Sociales'],
            'contact-name': ['Name', 'Nombre'],
            'contact-placeholder-name': ['Your Name', 'Tu Nombre'],
            'contact-email': ['Email', 'Correo Electrónico'],
            'contact-placeholder-email': ['Your Email', 'Tu Correo Electrónico'],
            'contact-subject': ['Subject', 'Asunto'],
            'contact-placeholder-subject': ['Subject', 'Asunto'],
            'contact-message': ['Message', 'Mensaje'],
            'contact-placeholder-message': ['Your Message', 'Tu Mensaje'],
            'contact-send': ['Send Message', 'Enviar Mensaje']
        };

        // Funcionalidad de cambio de idioma
        document.addEventListener('DOMContentLoaded', function() {
            const languageToggle = document.getElementById('languageToggle');

            function updateLanguage(lang) {
                document.documentElement.lang = lang;

                // Update translations
                Object.keys(translations).forEach(key => {
                    const elements = document.querySelectorAll(`[data-translate="${key}"]`);
                    elements.forEach(el => {
                        const index = lang === 'es' ? 1 : 0;
                        if (translations[key] && translations[key][index]) {
                            el.innerHTML = translations[key][index];
                        }
                    });
                });

                // Show/hide language-specific paragraphs
                document.querySelectorAll('[data-translate-lang]').forEach(el => {
                    if (el.getAttribute('data-translate-lang') === lang) {
                        el.style.display = '';
                    } else {
                        el.style.display = 'none';
                    }
                });

                // Update toggle button label
                languageToggle.textContent = lang === 'es' ? 'EN' : 'ES';
            }

            if (languageToggle) {
                languageToggle.addEventListener('click', function() {
                    const currentLang = document.documentElement.lang || 'en';
                    const newLang = currentLang === 'en' ? 'es' : 'en';
                    updateLanguage(newLang);
                });

                // Initialize on page load
                updateLanguage(document.documentElement.lang || 'en');
            }
        });