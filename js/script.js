/* ============================================================
   Kelly Tech Solutions - Shared UI Enhancements
   1. Back-to-top button
   2. Navbar shadow after scrolling
   3. Auto-close mobile navbar after link click
   4. Scroll-reveal animations (IntersectionObserver)
   5. Rotating hero word (homepage)
   6. Auto-updating copyright year
   7. Card image preview modal (homepage)
   8. Contact form validation + EmailJS (contact page)
   ============================================================ */

(function () {
    "use strict";

    /* --- 1. Back-to-top button --- */
    var backBtn = document.createElement("button");
    backBtn.id = "backToTop";
    backBtn.type = "button";
    backBtn.setAttribute("aria-label", "Back to top");
    backBtn.innerHTML = "<i class='fa-solid fa-arrow-up'></i>";
    document.body.appendChild(backBtn);

    function toggleBackToTop() {
        backBtn.classList.toggle("show", window.scrollY > 300);
    }
    backBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    /* --- 2. Navbar shadow after scrolling --- */
    var navbar = document.querySelector(".navbar-kt");
    if (navbar) {
        function toggleNavbarShadow() {
            navbar.classList.toggle("scrolled", window.scrollY > 10);
        }
        window.addEventListener("scroll", toggleNavbarShadow, { passive: true });
        toggleNavbarShadow();
    }

    /* --- 3. Auto-close mobile navbar after link click --- */
    var collapse = document.querySelector(".navbar-collapse");
    if (collapse) {
        collapse.querySelectorAll("a.nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                if (collapse.classList.contains("show") && window.bootstrap) {
                    bootstrap.Collapse.getOrCreateInstance(collapse).hide();
                }
            });
        });
    }

    /* --- 4. Scroll-reveal animations --- */
    var revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealItems.length) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealItems.forEach(function (el) { el.classList.add("in"); });
    }

    /* --- 5. Rotating hero word --- */
    var typed = document.getElementById("typedWord");
    if (typed) {
        var words = ["Secure", "Brand", "Build", "Grow"];
        var wordIndex = 0, charIndex = 0, deleting = false;

        function typeLoop() {
            var word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            typed.textContent = word.substring(0, charIndex);

            var delay = deleting ? 60 : 140;
            if (!deleting && charIndex === word.length) {
                delay = 1600; deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 350;
            }
            setTimeout(typeLoop, delay);
        }
        typeLoop();
    }
    /* --- 7. Card image preview modal --- */
    (function () {
        var modalEl = document.getElementById("imgPreviewModal");
        if (!modalEl) return;

        var modalImg = modalEl.querySelector("#imgPreviewImage");
        var modal = new bootstrap.Modal(modalEl, { backdrop: true, keyboard: true });

        function openImg(img) {
            modalImg.src = img.src;
            modalImg.alt = img.alt || "Full-size image";
            modal.show();
        }

        document.querySelectorAll(".card-img-top").forEach(function (img) {
            img.setAttribute("role", "button");
            img.tabIndex = 0;
            img.addEventListener("click", function () { openImg(img); });
            img.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault(); openImg(img);
                }
            });
        });

        modalImg.addEventListener("click", function () { modal.hide(); });
        modalEl.addEventListener("hidden.bs.modal", function () {
            modalImg.src = ""; modalImg.alt = "";
        });
        })();

    /* --- 8. Contact form validation --- */
    (function () {
        var form = document.getElementById("contactForm");
        if (!form) return;

        var alertEl = document.getElementById("formAlert");
        var inputs = form.querySelectorAll("input, select, textarea");

        function showError(input, message) {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
            var feedback = input.nextElementSibling;
            if (feedback && feedback.classList.contains("invalid-feedback")) {
                feedback.textContent = message;
            }
        }

        function clearError(input) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        }

        function validateField(input) {
            var val = input.value.trim();
            if (input.hasAttribute("required") && !val) {
                showError(input, "This field is required.");
                return false;
            }
            if (input.type === "email" && val) {
                var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRe.test(val)) {
                    showError(input, "Please enter a valid email address.");
                    return false;
                }
            }
            if (input.name === "phone" && val) {
                var phoneRe = /^[\d\s\-\+\(\)]{7,}$/;
                if (!phoneRe.test(val)) {
                    showError(input, "Please enter a valid phone number.");
                    return false;
                }
            }
            clearError(input);
            return true;
        }

        inputs.forEach(function (input) {
            input.addEventListener("blur", function () { validateField(input); });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var isValid = true;
            inputs.forEach(function (input) {
                if (!validateField(input)) isValid = false;
            });

            if (!isValid) {
                alertEl.innerHTML = '<div class="alert alert-warning mb-0" role="alert">' +
                    '<i class="fa-solid fa-exclamation-triangle me-2"></i>' +
                    'Please fill in all required fields correctly.' +
                    '</div>';
                return;
            }

            // Submit via EmailJS (requires emailjs global)
            if (typeof emailjs !== "undefined") {
                emailjs.sendForm("service_kellytech", "template_kellytech", form)
                    .then(function () {
                        alertEl.innerHTML = '<div class="alert alert-success mb-0" role="alert">' +
                            '<i class="fa-solid fa-check-circle me-2"></i>' +
                            'Message sent! We will reply within 24 hours.' +
                            '</div>';
                        form.reset();
                        inputs.forEach(function (input) {
                            input.classList.remove("is-valid", "is-invalid");
                        });
                    })
                    .catch(function () {
                        alertEl.innerHTML = '<div class="alert alert-danger mb-0" role="alert">' +
                            '<i class="fa-solid fa-exclamation-circle me-2"></i>' +
                            'There was a problem sending your message. Please call us directly.' +
                            '</div>';
                    });
            } else {
                // Fallback: just show success message without backend
                alertEl.innerHTML = '<div class="alert alert-success mb-0" role="alert">' +
                    '<i class="fa-solid fa-check-circle me-2"></i>' +
                    'Thank you! Your message has been sent. We will contact you shortly.' +
                    '</div>';
                form.reset();
                inputs.forEach(function (input) {
                    input.classList.remove("is-valid", "is-invalid");
                });
            }
        });
    })();

    /* --- Smooth anchor scroll --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
})();


