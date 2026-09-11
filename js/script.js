/* ============================================================
   Kelly Tech Solutions - Shared UI enhancements
   1. Back-to-top button (injected on every page)
   2. Navbar shadow after scrolling
   ============================================================ */

(function () {
    "use strict";

    // --- 1. Back-to-top button ---
    var btn = document.createElement("button");
    btn.id = "backToTop";
    btn.type = "button";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = "&#8679;"; // up arrow
    btn.title = "Back to top";
    document.body.appendChild(btn);

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    }

    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    // --- 2. Navbar shadow after scrolling ---
    var navbar = document.querySelector(".navbar");
    if (navbar) {
        function toggleNavbarShadow() {
            if (window.scrollY > 10) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
        window.addEventListener("scroll", toggleNavbarShadow, { passive: true });
        toggleNavbarShadow();
    }
})();

