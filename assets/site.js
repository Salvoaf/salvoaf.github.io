(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#main-navigation");
  if (toggle && menu) {
    const close = () => {toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Apri il menu");menu.classList.remove("is-open");};
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
      menu.classList.toggle("is-open", open);
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", close));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });
    window.addEventListener("resize", () => {if (window.innerWidth > 820) close();});
  }

  const car = document.querySelector("[data-service-carousel]");
  if (car) {
    const rail = car.querySelector("[data-carousel-track]");
    const slides = Array.from(rail.querySelectorAll(".special-card"));
    const prev = car.querySelector("[data-carousel-prev]");
    const next = car.querySelector("[data-carousel-next]");
    const current = car.querySelector("[data-carousel-count]");
    const bar = car.querySelector("[data-carousel-progress]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const pos = Math.max(0, Math.min(max, rail.scrollLeft));
      prev.disabled = pos <= 3;
      next.disabled = pos >= max - 3;
      const origin = slides[0] ? slides[0].offsetLeft : 0;
      let index = 0;
      slides.forEach((slide, i) => {
        if (slide.offsetLeft - origin <= pos + 15) index = i;
      });
      current.textContent = String(index + 1).padStart(2, "0");
      bar.style.width = String(max === 0 ? 100 : 12.5 + 87.5 * pos / max) + "%";
    };
    const move = direction => {
      const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
      const width = slides[0] ? slides[0].getBoundingClientRect().width : 300;
      rail.scrollBy({ left: direction * (width + gap), behavior: reduce.matches ? "instant" : "smooth" });
    };
    prev.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    rail.addEventListener("scroll", sync, { passive: true });
    rail.addEventListener("keydown", event => {
      if (event.target !== rail) return;
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    });
    window.addEventListener("resize", sync);
    sync();
  }

})();