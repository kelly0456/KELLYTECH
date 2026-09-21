/* ============================================================
   Kelly Tech Solutions - Shared UI enhancements
   1. Back-to-top button (injected on every page)
   2. Navbar shadow after scrolling
   3. Auto-close mobile navbar after a link is tapped
   4. Scroll-reveal animations (IntersectionObserver)
   5. Animated counters (about page)
   6. Rotating hero word (homepage)
   7. Auto-updating copyright year
   ============================================================ */

(function () {
    "use strict";

    /* --- 1. Back-to-top button --- */
    var btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "<i class='bi bi-arrow-up'></i>";
    btn.title = "Back to top";
    document.body.appendChild(btn);

    function toggleBackToTop() {
        btn.classList.toggle("show", window.scrollY > 300);
    }

    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    /* --- 2. Navbar shadow after scrolling --- */
    var navbar = document.querySelector(".navbar");
    if (navbar) {
        var toggleNavbarShadow = function () {
            navbar.classList.toggle("scrolled", window.scrollY > 10);
        };
        window.addEventListener("scroll", toggleNavbarShadow, { passive: true });
        toggleNavbarShadow();
    }

    /* --- 3. Auto-close the mobile navbar after clicking a link --- */
    var collapse = document.querySelector(".navbar-collapse");
    if (collapse) {
        collapse.querySelectorAll("a.nav-link").forEach(function (link) {
            link.addEventListener("click", function () {
                if (collapse.classList.contains("show")) {
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

    /* --- 5. Animated counters --- */
    var counters = document.querySelectorAll(".counter[data-count]");
    if ("IntersectionObserver" in window && counters.length) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                countObserver.unobserve(el);

                var target = parseInt(el.getAttribute("data-count"), 10) || 0;
                var duration = 1800;
                var start = null;

                function step(ts) {
                    if (!start) start = ts;
                    var progress = Math.min((ts - start) / duration, 1);
                    // ease-out for a natural slowdown at the end
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }, { threshold: 0.4 });

        counters.forEach(function (el) { countObserver.observe(el); });
    }

    /* --- 6. Rotating hero word --- */
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
                delay = 1600;           // pause on the full word
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 350;
            }
            setTimeout(typeLoop, delay);
        }
        typeLoop();
    }

    /* --- 7. Auto-updating copyright year --- */
    document.querySelectorAll(".kt-year").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();

