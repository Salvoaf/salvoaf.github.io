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


  // Activate the method card passing through the reading area on scroll.
  const phases = Array.from(document.querySelectorAll("[data-method-step]"));
  if (phases.length) {
    let pending = false;
    const highlight = () => {
      pending = false;
      const focusY = window.innerHeight * (window.innerWidth <= 700 ? 0.6 : 0.52);
      let chosen = 0;
      let delta = Infinity;
      phases.forEach((phase, i) => {
        const r = phase.getBoundingClientRect();
        const distance = Math.abs(r.top + r.height / 2 - focusY);
        if (distance < delta) { delta = distance; chosen = i; }
      });
      phases.forEach((phase, i) => {
        const active = i === chosen;
        phase.classList.toggle("is-active", active);
        if (active) phase.setAttribute("aria-current", "step");
        else phase.removeAttribute("aria-current");
      });
    };
    const schedule = () => {
      if (!pending) { pending = true; requestAnimationFrame(highlight); }
    };
    window.addEventListener("scroll", schedule, {passive:true});
    window.addEventListener("resize", schedule);
    highlight();
  }

  // Fade portfolio blocks in once as they enter the viewport.
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("pf-reveal-ready");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, {rootMargin:"0px 0px -8% 0px", threshold:0.08});
    reveals.forEach(el => observer.observe(el));
  }
})();