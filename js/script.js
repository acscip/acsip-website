/* ===================================================
   ACSIP — script.js
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---- NAVBAR: sticky shadow + hamburger ---- */
  const navbar    = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks  = document.getElementById("nav-links");

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open", isOpen);
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.classList.remove("open");
      });
    });
  }


  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 8 : 0;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: "smooth"
        });
      }
    });
  });


  /* ---- READ MORE buttons ---- */
  document.querySelectorAll(".read-more-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const moreText = btn.closest(".event-info").querySelector(".more-text");
      if (!moreText) return;
      const expanded = moreText.classList.toggle("visible");
      btn.classList.toggle("expanded", expanded);
      btn.innerHTML = expanded
        ? 'Read less <i class="fas fa-chevron-up"></i>'
        : 'Read more <i class="fas fa-chevron-down"></i>';
    });
  });


  /* ---- ABOUT PAGE: Image Slider ---- */
  const slides    = document.querySelectorAll(".slide");
  const dotsWrap  = document.getElementById("sliderDots");
  const prevBtn   = document.getElementById("prevBtn");
  const nextBtn   = document.getElementById("nextBtn");
  let currentSlide = 0;
  let autoplayTimer;

  if (slides.length > 0) {
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("dot");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      if (dotsWrap) dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      slides[currentSlide].classList.remove("active");
      const dots = dotsWrap ? dotsWrap.querySelectorAll(".dot") : [];
      if (dots[currentSlide]) dots[currentSlide].classList.remove("active");
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
      if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    }

    function nextSlide() { goTo(currentSlide + 1); }
    function prevSlide() { goTo(currentSlide - 1); }

    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

    function startAutoplay() { autoplayTimer = setInterval(nextSlide, 4500); }
    function resetAutoplay() { clearInterval(autoplayTimer); startAutoplay(); }
    startAutoplay();
  }


  /* ---- EVENTS PAGE: filter tabs ---- */
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const filter = tab.dataset.filter;
      const cards  = document.querySelectorAll(".event-card");
      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === "all" || cat === filter) {
          card.style.display = "";
          card.style.animation = "fadeIn 0.4s ease both";
        } else {
          card.style.display = "none";
        }
      });
    });
  });


  /* ---- GALLERY PAGE: Lightbox ---- */
  const lightbox       = document.getElementById("lightbox");
  const lightboxImg    = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose  = document.getElementById("lightboxClose");
  const lightboxPrev   = document.getElementById("lightboxPrev");
  const lightboxNext   = document.getElementById("lightboxNext");
  const galleryItems   = Array.from(document.querySelectorAll(".gm-item"));
  let lbIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems[index]) return;
    lbIndex = index;
    const item = galleryItems[index];
    lightboxImg.src = item.dataset.src || item.querySelector("img").src;
    lightboxCaption.textContent = item.dataset.title || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  }

  if (lightboxPrev) lightboxPrev.addEventListener("click", () => openLightbox((lbIndex - 1 + galleryItems.length) % galleryItems.length));
  if (lightboxNext) lightboxNext.addEventListener("click", () => openLightbox((lbIndex + 1) % galleryItems.length));

  document.addEventListener("keydown", e => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape")      closeLightbox();
    if (e.key === "ArrowLeft")   openLightbox((lbIndex - 1 + galleryItems.length) % galleryItems.length);
    if (e.key === "ArrowRight")  openLightbox((lbIndex + 1) % galleryItems.length);
  });


  /* ---- CONTACT FORM (EmailJS) ---- */
  const contactForm   = document.getElementById("contactForm");
  const formSuccess   = document.getElementById("formSuccess");
  const formError     = document.getElementById("formError");

  // ── Replace these three values with your own from emailjs.com ──
  const EMAILJS_PUBLIC_KEY  = "fTixf80QDQy4OTMnZ";
  const EMAILJS_SERVICE_ID  = "service_k5efv49";
  const EMAILJS_TEMPLATE_ID = "template_kyow1jc";
  // ────────────────────────────────────────────────────────────────

  if (contactForm) {
    contactForm.addEventListener("submit", e => {
      e.preventDefault(); // always stop page reload first

      const btn = contactForm.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      if (formSuccess) formSuccess.style.display = "none";
      if (formError)   formError.style.display   = "none";

      // Check EmailJS loaded
      if (typeof emailjs === "undefined") {
        console.error("EmailJS not loaded");
        if (formError) formError.style.display = "block";
        btn.disabled = false;
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        return;
      }

      emailjs.init(EMAILJS_PUBLIC_KEY);

      const templateParams = {
        from_name:  document.getElementById("name").value.trim(),
        from_email: document.getElementById("email").value.trim(),
        message:    document.getElementById("message").value.trim(),
        to_name:    "ACSIP Team",
      };

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          if (formSuccess) formSuccess.style.display = "block";
          contactForm.reset();
        })
        .catch(err => {
          console.error("EmailJS error:", err);
          if (formError) formError.style.display = "block";
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        });
    });
  }


  /* ---- SCROLL FADE-IN ---- */
  const fadeEls = document.querySelectorAll(
    ".activity-card, .event-card, .member, .cab-card, .mission-card, .pillar, .gm-item, .gallery-item, .stat-item"
  );

  fadeEls.forEach((el, i) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

});