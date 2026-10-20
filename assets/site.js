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
})();