// Scroll story: the week calendar stays fixed (CSS sticky); the text steps scroll normally.
// The active step is the last one whose top has crossed a reading line, so the calendar state
// depends only on scroll position and stays correct with fast or reverse scrolling.
(() => {
  const root = document.querySelector("[data-scroll-story]");
  if (!root) return;
  const steps = [...root.querySelectorAll(".ss-step")];
  const cells = [...root.querySelectorAll(".ss-cal-cells i[data-cat]")];
  const legend = [...root.querySelectorAll(".ss-cal-legend li")];
  const free = root.querySelector(".ss-free");
  const cal = root.querySelector(".ss-cal-wrap");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const LOST_AT = [1, 2, 3, 4];   // step at which each category of hours is marked as lost
  const HIGHLIGHT = {step: 5, cats: ["1", "3"]};   // hours caused by tools that do not talk to each other
  const RECOVERED_FROM = 6;

  let current = -1, shown = 40, countRaf = 0;
  function count(target) {
    cancelAnimationFrame(countRaf);
    if (reduced.matches || document.hidden) { shown = target; free.textContent = target; return; }
    const from = shown, start = performance.now();
    const step = now => {
      const t = Math.min(1, (now - start) / 450), e = 1 - Math.pow(1 - t, 3);
      shown = Math.round(from + (target - from) * e);
      free.textContent = shown;
      if (t < 1) countRaf = requestAnimationFrame(step);
    };
    countRaf = requestAnimationFrame(step);
  }

  function setStep(s) {
    let lost = 0;
    cells.forEach(c => {
      const cat = c.dataset.cat;
      const rec = c.dataset.rec !== undefined && s >= +c.dataset.rec;
      const isLost = s >= LOST_AT[cat] && !rec;
      if (isLost) lost++;
      c.classList.toggle("is-lost", isLost);
      c.classList.toggle("is-rec", rec);
      c.classList.toggle("is-hl", s === HIGHLIGHT.step && HIGHLIGHT.cats.includes(cat));
    });
    legend.forEach(li => {
      const k = li.dataset.k;
      li.classList.toggle("is-on", k === "r" ? s >= RECOVERED_FROM : s >= LOST_AT[k]);
    });
    steps.forEach((el, i) => el.classList.toggle("is-active", i === s));
    count(40 - lost);
  }

  function pick() {
    // Desktop reads at mid-screen; on mobile the line sits in the free space below the pinned calendar.
    const mobile = innerWidth <= 900;
    const calBottom = mobile ? cal.getBoundingClientRect().bottom : 0;
    const line = mobile ? calBottom + (innerHeight - calBottom) * .45 : innerHeight * .55;
    let active = 0;
    steps.forEach((el, i) => { if (el.getBoundingClientRect().top < line) active = i; });
    if (active !== current) { current = active; setStep(active); }
  }

  root.classList.add("ss-live");
  pick();
  // Reading a few rects per scroll event is cheap and, unlike rAF, never stalls in a background tab.
  addEventListener("scroll", pick, {passive: true});
  addEventListener("resize", pick);
})();
