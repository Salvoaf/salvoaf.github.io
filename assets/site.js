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

  // Continuous, seamless, self-running gallery for specialist services.
  // Duplicated cards are presentation-only for assistive technologies.
  const carousel = document.querySelector("[data-service-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const originals = Array.from(track.querySelectorAll(".special-card"));
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const counter = carousel.querySelector("[data-carousel-count]");
    const progress = carousel.querySelector("[data-carousel-progress]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inViewport = !("IntersectionObserver" in window);
    let pointerOver = false;
    let focused = false;
    let touching = false;
    let resumeAfter = 0;
    let previousFrame = 0;
    let cycleWidth = 0;
    const SPEED_PX_PER_SECOND = 46;

    const duplicates = originals.map(card => {
      const copy = card.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      copy.setAttribute("tabindex", "-1");
      copy.querySelectorAll("a, button, input, [tabindex]").forEach(el => el.setAttribute("tabindex", "-1"));
      copy.classList.add("carousel-duplicate");
      track.appendChild(copy);
      return copy;
    });

    const measure = () => {
      if (!originals.length || !duplicates.length) return;
      cycleWidth = duplicates[0].offsetLeft - originals[0].offsetLeft;
      if (cycleWidth > 0 && track.scrollLeft >= cycleWidth) {
        track.scrollLeft %= cycleWidth;
      }
    };

    const sync = () => {
      if (!originals.length || !cycleWidth) return;
      const x = ((track.scrollLeft % cycleWidth) + cycleWidth) % cycleWidth;
      const step = cycleWidth / originals.length;
      const index = Math.min(originals.length - 1, Math.floor((x + 8) / step));
      counter.textContent = String(index + 1).padStart(2, "0");
      progress.style.width = String(12.5 + 87.5 * x / cycleWidth) + "%";
      // Both directions remain available in an infinite gallery.
      previous.disabled = false;
      next.disabled = false;
    };

    const step = direction => {
      measure();
      if (!cycleWidth) return;
      const width = cycleWidth / originals.length;
      let target = track.scrollLeft + direction * width;
      if (target < 0) target += cycleWidth;
      if (target >= cycleWidth) target -= cycleWidth;
      // The infinite carousel is continuous; jump only on explicit arrow actions.
      track.scrollLeft = target;
      resumeAfter = performance.now() + 4500;
      sync();
    };

    const tick = now => {
      const elapsed = previousFrame ? Math.min(80, now - previousFrame) : 0;
      previousFrame = now;
      if (cycleWidth && inViewport && !document.hidden && !reducedMotion.matches &&
          !pointerOver && !focused && !touching && now >= resumeAfter) {
        const nextX = track.scrollLeft + SPEED_PX_PER_SECOND * elapsed / 1000;
        track.scrollLeft = nextX >= cycleWidth ? nextX - cycleWidth : nextX;
      }
      requestAnimationFrame(tick);
    };

    previous.addEventListener("click", () => step(-1));
    next.addEventListener("click", () => step(1));
    track.addEventListener("scroll", sync, {passive:true});
    track.addEventListener("keydown", e => {
      if (e.target !== track) return;
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });

    carousel.addEventListener("mouseenter", () => { pointerOver = true; });
    carousel.addEventListener("mouseleave", () => { pointerOver = false; resumeAfter = performance.now() + 800; });
    carousel.addEventListener("focusin", () => { focused = true; });
    carousel.addEventListener("focusout", e => {
      if (!carousel.contains(e.relatedTarget)) {
        focused = false;
        resumeAfter = performance.now() + 1600;
      }
    });
    track.addEventListener("touchstart", () => { touching = true; }, {passive:true});
    track.addEventListener("touchend", () => { touching = false; resumeAfter = performance.now() + 4500; }, {passive:true});
    track.addEventListener("touchcancel", () => { touching = false; resumeAfter = performance.now() + 4500; }, {passive:true});
    track.addEventListener("pointerdown", () => { resumeAfter = performance.now() + 4500; });
    window.addEventListener("resize", () => { measure(); sync(); });
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(entries => {
        inViewport = entries.some(e => e.isIntersecting);
      }, {threshold:0.1});
      observer.observe(carousel);
    }
    measure();
    sync();
    requestAnimationFrame(tick);
  }
})();