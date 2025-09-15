// Variable global para el índice del modal
let currentIndex = 0;
let galleryItems = []; // Initialize empty array

// Translations object
const translations = {
  // Navegación
  "nav-home": ["Home", "Inicio"],
  "nav-gallery": ["Gallery", "Galería"],
  "nav-featured": ["Projects", "Proyectos"],
  "nav-about": ["Profile", "Perfil"],
  "nav-contact": ["Contact", "Contacto"],

  // Hero
  "hero-subtitle": [
    "Exploring the intersection of imagination<br>and artificial intelligence",
    "Explorando la intersección entre imaginación<br>e inteligencia artificial",
  ],
  "hero-btn": ["Discover Works", "Ver Obras"],

  // Secciones
  "section-gallery": ["Gallery", "Galería"],
  "section-featured": ["Featured Projects", "Proyectos Destacados"],
  "section-about": ["Profile", "Perfil"],
  "section-contact": ["Contact", "Contacto"],

  // Featured Projects
  "chakana-title": ["Chakana Rebelde", "Chakana Rebelde"],
  "chakana-desc": [
    "At 4,000 meters high, where authenticity is not a choice: it is survival. A visual journey through reimagined Andean cultural resistance.",
    "A 4,000 metros de altura, donde la autenticidad no es elección: es supervivencia. Un viaje visual por la resistencia cultural andina reimaginada.",
  ],
  "project-explore": ["Explore project →", "Explorar proyecto →"],
  "video-title": [
    "Xylos': The Garden of Mutant Echoes",
    "Xylos': El Jardín de los Ecos Mutantes",
  ],
  "video-desc": [
    "Spatio-temporal anomaly where reality distorts and perception fragments in an infinite loop.",
    "Anomalía espacio-temporal donde la realidad se distorsiona y la percepción se fragmenta en un bucle infinito.",
  ],
  "video-watch": ["Watch video", "Ver video"],

  // Profile Content
  "about-title": ["Santiago Narváez", "Santiago Narváez"],
  "about-p1": [
    "As a digital artist exploring the frontiers of AI-assisted creation, I blend traditional artistic sensibilities with cutting-edge technology to craft immersive visual experiences that challenge perceptions and evoke emotion.",
    "Como artista digital que explora las fronteras de la creación asistida por IA, combino sensibilidades artísticas tradicionales con tecnología de vanguardia para crear experiencias visuales inmersivas que desafían percepciones y evocan emociones.",
  ],
  "about-p2": [
    "I am a photographer and digital artist, specializing in capturing unique moments and transforming them into impactful visual experiences. My work explores the intersection of human imagination and artificial intelligence, creating dreamlike landscapes, surreal portraits and futuristic visions that exist in the liminal space between the real and the imagined.",
    "Soy fotógrafo y artista digital, especializado en capturar momentos únicos y transformarlos en experiencias visuales impactantes. Mi trabajo explora la intersección entre la imaginación humana y la inteligencia artificial, creando paisajes oníricos, retratos surrealistas y visiones futuristas que existen en el espacio liminal entre lo real y lo imaginado.",
  ],
  "about-p3": [
    "Drawing inspiration from both natural phenomena and digital abstractions, I strive to create pieces that feel both familiar and otherworldly, inviting viewers to question the boundaries between human creativity and technological innovation.",
    "Inspirándome tanto en fenómenos naturales como en abstracciones digitales, me esfuerzo por crear piezas que se sientan familiares y ajenas al mismo tiempo, invitando a los espectadores a cuestionar los límites entre la creatividad humana y la innovación tecnológica.",
  ],
  "about-p4": [
    "Through my portfolio, I invite you to journey through these digital realms – spaces of contemplation, wonder, and possibility that reflect our evolving relationship with technology and the expanding horizons of artistic expression.",
    "A través de mi portafolio, te invito a viajar por estos reinos digitales: espacios de contemplación, asombro y posibilidad que reflejan nuestra relación en evolución con la tecnología y los horizontes en expansión de la expresión artística.",
  ],

  // Contact
  "contact-location": ["Location", "Ubicación"],
  "contact-email": ["Email", "Email"],
  "contact-social": ["Social Media", "Redes Sociales"],
  "contact-name": ["Name", "Nombre"],
  "contact-message": ["Message", "Mensaje"],
  "contact-send": ["Send Message", "Enviar Mensaje"],
  "contact-placeholder-name": ["Your Name", "Tu Nombre"],
  "contact-placeholder-email": ["Your Email", "Tu Email"],
  "contact-subject-label": ["Subject", "Asunto"],
  "contact-placeholder-subject": ["Subject", "Asunto"],
  "contact-placeholder-message": ["Your Message", "Tu Mensaje"],
  "contact-email-label": ["Email", "Email"],
  "contact-freelance": ["Freelance Projects", "Proyectos Freelance"],
  "contact-available-short": ["Available on Contra", "Disponible en Contra"],
};

// Espera a que el contenido HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Initialize gallery items
  galleryItems = Array.from(document.querySelectorAll(".gallery-item"));

  // --- Funcionalidad del Menú Hamburguesa ---
  const hamburger = document.getElementById("hamburger");
  const navMenuOverlay = document.getElementById("navMenuOverlay");
  const navLinks = document.querySelectorAll(".nav-link");
  const body = document.body;

  // Toggle menú
  function toggleMenu() {
    if (hamburger && navMenuOverlay) {
      hamburger.classList.toggle("active");
      navMenuOverlay.classList.toggle("active");
      body.classList.toggle("menu-open");
    }
  }

  // Abrir/cerrar con hamburguesa
  if (hamburger) {
    hamburger.addEventListener("click", toggleMenu);
  }

  // Cerrar al hacer click en un link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger && navMenuOverlay) {
        hamburger.classList.remove("active");
        navMenuOverlay.classList.remove("active");
        body.classList.remove("menu-open");
      }
    });
  });

  // Cerrar al hacer click fuera
  if (navMenuOverlay) {
    navMenuOverlay.addEventListener("click", (e) => {
      if (e.target === navMenuOverlay) {
        toggleMenu();
      }
    });
  }

  // Cerrar con ESC
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      navMenuOverlay &&
      navMenuOverlay.classList.contains("active")
    ) {
      toggleMenu();
    }
  });

  // --- Funcionalidad del botón Back to Top ---
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });
  }

  // --- Efecto de navegación en scroll ---
  const nav = document.querySelector(".nav-container");
  if (nav) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 80) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    });
  }

  // --- Navegación suave para links internos ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.length > 0 && href.startsWith("#")) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerOffset = nav ? nav.offsetHeight : 0;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset - 50;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // --- Modal de Imagen ---
  const modal = document.getElementById("imageModal");
  const modalContent = modal.querySelector(".modal-content");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalDescription = document.getElementById("modalDescription");
  const closeBtn = modal.querySelector(".modal-close");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function openModal(index) {
    if (index < 0) index = galleryItems.length - 1;
    if (index >= galleryItems.length) index = 0;
    currentIndex = index;

    const item = galleryItems[currentIndex];
    const imgElement = item.querySelector("img");
    if (!imgElement) return;

    const imgSrc = imgElement.getAttribute("src");
    const currentLang = document.documentElement.lang || "es";
    const titleAttr = currentLang === "es" ? "data-title-es" : "data-title";
    const title =
      item.getAttribute(titleAttr) || item.getAttribute("data-title") || "";
    const category = item.getAttribute("data-category") || "";
    const descriptionAttr =
      currentLang === "es" ? "data-description-es" : "data-description";
    const description =
      item.getAttribute(descriptionAttr) ||
      item.getAttribute("data-description") ||
      "";

    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDescription.textContent = description;

    modalImg.src = "";
    modalImg.onload = () => {
      const isVertical = modalImg.naturalHeight > modalImg.naturalWidth;
      const isWideScreen = window.innerWidth >= 769;

      modalContent.classList.remove("layout-vertical", "layout-horizontal");

      if (isVertical && isWideScreen) {
        modalContent.classList.add("layout-vertical");
      } else {
        modalContent.classList.add("layout-horizontal");
      }
    };

    modalImg.setAttribute("src", imgSrc);
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openModal(index));
  });

  if (modal) {
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(currentIndex + 1);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("active")) return;
      switch (e.key) {
        case "ArrowLeft":
          openModal(currentIndex - 1);
          break;
        case "ArrowRight":
          openModal(currentIndex + 1);
          break;
        case "Escape":
          closeModal();
          break;
      }
    });
  }

  // --- Video Modal Functionality ---
  const videoModal = document.getElementById("videoModal");
  const videoTriggers = document.querySelectorAll("[data-video-trigger]");
  const youtubePlayer = document.getElementById("youtubePlayer");
  const videoClose = videoModal
    ? videoModal.querySelector(".video-close")
    : null;

  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      if (videoModal && youtubePlayer) {
        youtubePlayer.src =
          "https://www.youtube.com/embed/ffyYAaFTrkk?autoplay=1";
        videoModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  if (videoClose) {
    videoClose.addEventListener("click", function () {
      if (videoModal && youtubePlayer) {
        videoModal.classList.remove("active");
        youtubePlayer.src = "";
        document.body.style.overflow = "auto";
      }
    });
  }

  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === videoModal) {
        videoModal.classList.remove("active");
        youtubePlayer.src = "";
        document.body.style.overflow = "auto";
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      videoModal &&
      videoModal.classList.contains("active")
    ) {
      videoModal.classList.remove("active");
      if (youtubePlayer) youtubePlayer.src = "";
      document.body.style.overflow = "auto";
    }
  });

  // --- Contact Form Handling ---
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const submitButton = contactForm.querySelector('button[type="submit"]');

      if (
        nameInput.value.trim() &&
        emailInput.value.trim() &&
        messageInput.value.trim()
      ) {
        if (submitButton) submitButton.disabled = true;
        alert("Thank you for your message. I will get back to you soon!");
        contactForm.reset();
        if (submitButton) submitButton.disabled = false;
      } else {
        alert("Please fill in all required fields.");
      }
    });
  }

  // --- Language Toggle ---
  const languageToggle = document.getElementById("languageToggle");
  let currentLang = localStorage.getItem("language") || "es";

  function updateLanguage(lang) {
    if (!lang || (lang !== "en" && lang !== "es")) lang = "es";
    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);

    const targetIndex = lang === "es" ? 1 : 0;

    Object.keys(translations).forEach((key) => {
      const elements = document.querySelectorAll(`[data-translate="${key}"]`);
      elements.forEach((el) => {
        if (
          translations[key] &&
          typeof translations[key][targetIndex] !== "undefined"
        ) {
          el.innerHTML = translations[key][targetIndex];
        } else {
          console.warn(
            `Translation missing for key "${key}" in language "${lang}"`
          );
        }
      });
    });

    document.querySelectorAll("[data-translate-attr]").forEach((el) => {
      const attrName = el.getAttribute("data-translate-attr");
      const translationKey = el.getAttribute("data-translate");
      if (
        attrName &&
        translationKey &&
        translations[translationKey] &&
        typeof translations[translationKey][targetIndex] !== "undefined"
      ) {
        el.setAttribute(attrName, translations[translationKey][targetIndex]);
      } else {
        console.warn(
          `Attribute translation missing for key "${translationKey}" in language "${lang}"`
        );
      }
    });

    if (languageToggle) {
      languageToggle.textContent = lang === "es" ? "EN" : "ES";
    }

    if (modal && modal.classList.contains("active")) {
      openModal(currentIndex);
    }
  }

  if (languageToggle) {
    languageToggle.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "es" : "en";
      updateLanguage(currentLang);
    });
    updateLanguage(currentLang);
  } else {
    updateLanguage("es");
  }
});
