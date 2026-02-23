// MAIN INITIALIZATION
window.addEventListener("load", () => {
  // Splash logo animation
  const splash = document.getElementById("splash-screen");
  const logo = document.getElementById("splash-logo");

  if (splash && logo) {
    // fade logo in + scale
    requestAnimationFrame(() => {
      logo.style.opacity = "1";
      logo.style.transform = "scale(1)";
    });

    // keep for ~2s, then fade overlay out
    setTimeout(() => {
      splash.style.opacity = "0";
      setTimeout(() => {
        splash.remove();
      }, 600); // match CSS transition
    }, 2000);
  }

  // Language setup
  const savedLang = localStorage.getItem("lang") || "en";
  applyLanguage(savedLang);

  const langToggleBtn = document.getElementById("lang-toggle");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      const currentLang = localStorage.getItem("lang") || "en";
      const newLang = currentLang === "fr" ? "en" : "fr";
      localStorage.setItem("lang", newLang);
      applyLanguage(newLang);

      // Pause and reset intro videos on language change
      const videoEN = document.getElementById("video-en");
      const videoFR = document.getElementById("video-fr");
      if (videoEN) {
        videoEN.pause();
        videoEN.currentTime = 0;
      }
      if (videoFR) {
        videoFR.pause();
        videoFR.currentTime = 0;
      }
    });
  }

  // Form confirmation animation
  const success = document.getElementById("form-success");
  if (window.location.href.includes("#form-success") && success) {
    success.classList.add("show");
  }

  // Scroll fade-in observer
  const fadeElements = document.querySelectorAll("[data-fade]");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px" }
  );
  fadeElements.forEach(el => observer.observe(el));

  // Generic slideshow (if any)
  initGenericSlideshow();

  // Testimonial carousel
  initTestimonialCarousel();

  // FAQ accordion
  initFaqAccordion();

  // Industry dropdowns (Who we help page)
  initIndustryDropdowns();

  // Back to top button
  initBackToTop();

  // Ensure videos are playsinline for mobile
  document.querySelectorAll("video").forEach(v => {
    v.setAttribute("playsinline", "true");
  });

  // Optional chat init (only if chat elements exist)
  initChatIfPresent();
});

// LANGUAGE
function applyLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll(".lang.fr").forEach(el => {
    el.style.display = lang === "fr" ? "" : "none";
  });
  document.querySelectorAll(".lang.en").forEach(el => {
    el.style.display = lang === "en" ? "" : "none";
  });

  // Lang toggle button content is driven by .lang.en / .lang.fr spans inside it
}

// TESTIMONIAL CAROUSEL
function initTestimonialCarousel() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const carousel = document.querySelector(".testimonial-carousel");

  if (!slides.length || !carousel) return;

  let currentIndex = 0;
  let intervalId = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function startAuto() {
    stopAuto();
    intervalId = setInterval(nextSlide, 6000); // auto-rotate every 6s
  }

  function stopAuto() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Buttons
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAuto();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAuto();
    });
  }

  // Dots
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      showSlide(idx);
      startAuto();
    });
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);

  // Init
  showSlide(0);
  startAuto();
}

// GENERIC SLIDESHOW (for any .slideshow-image)
function initGenericSlideshow() {
  const slides = document.querySelectorAll(".slideshow-image");
  if (!slides.length) return;

  let slideIndex = 0;

  function showSlides() {
    slides.forEach((slide, i) => {
      slide.style.display = i === slideIndex ? "block" : "none";
    });

    slideIndex = (slideIndex + 1) % slides.length;
    setTimeout(showSlides, 3000);
  }

  showSlides();
}

// INDUSTRY DROPDOWNS (Who we help page) — accordion: only one open at a time
function initIndustryDropdowns() {
  const container = document.querySelector(".industry-dropdowns");
  if (!container) return;

  // Single delegated listener so only one handler runs per click
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".industry-dropdown-trigger");
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const item = btn.closest(".industry-dropdown");
    if (!item) return;

    const wasOpen = item.classList.contains("is-open");

    // 1. Close every dropdown immediately
    container.querySelectorAll(".industry-dropdown").forEach((el) => {
      el.classList.remove("is-open");
      const t = el.querySelector(".industry-dropdown-trigger");
      if (t) t.setAttribute("aria-expanded", "false");
    });

    // 2. Open the clicked one only in the next frame (after close has been applied)
    if (!wasOpen) {
      requestAnimationFrame(() => {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      });
    }
  });
}

// FAQ ACCORDION
function initFaqAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("is-open");
        const q = el.querySelector(".faq-question");
        if (q) q.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// BACK TO TOP
function initBackToTop() {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-to-top";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "<i class=\"fas fa-arrow-up\"></i>";
  btn.addEventListener("click", () => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    window.scrollTo({ top: 0, behavior: isTouch ? "auto" : "smooth" });
  });
  document.body.appendChild(btn);

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          btn.classList.add("is-visible");
        } else {
          btn.classList.remove("is-visible");
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
}

// MOBILE NAV
function toggleMobileNav() {
  document.querySelector(".nav-links")?.classList.toggle("show");
}

// Close mobile nav when a nav link is clicked (prevents stuck menu)
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.remove("show");
  });
});

// OPTIONAL CHAT WIDGET (only runs if markup exists)
function initChatIfPresent() {
  const chatForm = document.getElementById("chat-form");
  if (!chatForm) return;

  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const input = document.getElementById("user-input");
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    appendMessage("user", message);
    input.value = "";

    try {
      const response = await fetch("https://your-backend.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      appendMessage("bot", data.reply || "Sorry, no response.");
    } catch (err) {
      appendMessage("bot", "Error contacting AI.");
    }
  });
}

function appendMessage(sender, text) {
  const msgContainer = document.getElementById("chat-messages");
  if (!msgContainer) return;

  const msg = document.createElement("div");
  msg.className = sender;
  msg.textContent = text;
  msgContainer.appendChild(msg);
  msgContainer.scrollTop = msgContainer.scrollHeight;
}

function toggleChat() {
  const chatBody = document.getElementById("chat-body");
  if (!chatBody) return;
  chatBody.style.display = chatBody.style.display === "none" ? "block" : "none";
}