// Scroll story: one sticky stage whose visual state is a pure function of scroll progress p ∈ [0,1].
// Continuous changes (positions, line drawing, packets) are scrubbed from p every frame;
// small discrete events (cell fills, labels, text scenes) are thresholds on p with CSS transitions.
(() => {
  const root = document.querySelector("[data-scroll-story]");
  if (!root || !document.documentElement.classList.contains("ss-js")) return;
  const canvas = root.querySelector(".ss-canvas");
  const scenes = [...root.querySelectorAll(".ss-scene")];
  const railItems = [...root.querySelectorAll(".ss-rail li")];
  const railFills = railItems.map(li => li.querySelector("b"));
  const legend = [...root.querySelectorAll(".ss-legend li")];
  const steps = [...root.querySelectorAll(".ss-steps li")];
  const stepNow = root.querySelector(".ss-step-now");
  const stage = root.querySelector(".ss-stage");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const SVG = "http://www.w3.org/2000/svg";

  // ---------- Timeline (fractions of the pinned scroll distance) ----------
  const SCENE_START = [0, .25, .5, .745];
  const RAIL = [[0, .22], [.25, .47], [.5, .72], [.745, .97]];
  const CAT_WINDOWS = [[.035, .075], [.08, .12], [.125, .16], [.165, .2]];
  const MORPH = [.27, .4];       // grid -> system rows
  const MANUAL_IN = [.31, .36], MANUAL_OUT = [.5, .55];
  const ALIGN = [.51, .6];       // scattered systems -> clean ring
  const HUB_IN = [.52, .58], LINKS = [.55, .65], MERGE = [.6, .68];
  const AGENT_IN = [.75, .79], AGENT_LINK = [.76, .8], STEPS = [.795, .965];

  // ---------- Demo data ----------
  const CATS = [7, 6, 5, 4];
  const SYSTEMS = [
    {name: "CRM", b: [.25, .25, -4], c: [.19, .35]},
    {name: "Gestionale", b: [.75, .2, 3], c: [.81, .35]},
    {name: "Fogli Excel", b: [.22, .64, 2.5], c: [.19, .72]},
    {name: "Database", b: [.79, .6, -3], c: [.81, .72]},
    {name: "Email", b: [.5, .87, 1.5], c: [.5, .88]}
  ];
  const HUB = [.5, .535], AGENT = [.5, .12];
  const MANUAL = [[4, 2], [2, 1], [1, 0], [0, 2], [3, 2], [4, 0], [1, 3]];
  const AGENT_STATUS = ["Obiettivo ricevuto", "Piano in tre passi", "Usa gli strumenti", "Controlla i dati", "Attende il tuo ok", "Completato"];
  const STEP_TOOLS = [[], [], [4, 0, 1], [3], [], [4, 0]];
  const DAYS = ["LUN", "MAR", "MER", "GIO", "VEN"], HOURS = ["9", "10", "11", "12", "14", "15", "16", "17"];

  // Deterministic scatter of the 22 lost hours across the 40 cells.
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const order = [...Array(40).keys()].map(i => [rand(), i]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  const catOf = new Array(40).fill(-1);
  let k = 0;
  CATS.forEach((n, c) => { for (let j = 0; j < n; j++) catOf[order[k++]] = c; });

  // ---------- Build DOM ----------
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html) n.innerHTML = html; canvas.appendChild(n); return n; };
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("class", "ss-lines");
  canvas.appendChild(svg);
  const svgEl = (tag, cls) => { const n = document.createElementNS(SVG, tag); n.setAttribute("class", cls); svg.appendChild(n); return n; };
  const manualPaths = MANUAL.map(() => svgEl("path", "ss-manual"));
  const linkPaths = SYSTEMS.map(() => svgEl("path", "ss-link"));
  const agentPath = svgEl("path", "ss-link");
  const packets = MANUAL.map(() => { const r = svgEl("rect", "ss-packet"); r.setAttribute("width", 7); r.setAttribute("height", 7); r.setAttribute("rx", 1.5); return r; });
  const pulses = SYSTEMS.map(() => { const c = svgEl("circle", "ss-pulse"); c.setAttribute("r", 3); return c; });
  const agentPulse = svgEl("circle", "ss-pulse is-hot");
  agentPulse.setAttribute("r", 3);

  const counter = el("div", "ss-counter", "<b>40</b><span>ore libere<br>su 40</span>");
  const counterNum = counter.firstChild;
  const dayLabels = DAYS.map(d => el("span", "ss-label", d));
  const hourLabels = HOURS.map(h => el("span", "ss-label", h));
  const cards = SYSTEMS.map(s => el("div", "ss-card", `<header><span>${s.name}</span><s>a mano</s></header>`));
  const cardTags = cards.map(c => c.querySelector("s"));
  const cats = ["var(--ss-c0)", "var(--ss-c1)", "var(--ss-c2)", "var(--ss-c3)"];
  const cells = [...Array(40).keys()].map(i => {
    const n = el("div", "ss-cell");
    if (catOf[i] >= 0) n.style.setProperty("--c", cats[catOf[i]]);
    return n;
  });
  const hub = el("div", "ss-hub", "<strong>Software su misura</strong><span>API · integrazioni</span>");
  const agent = el("div", "ss-agent", '<i class="ss-agent-mark"></i><div><strong>Agente AI</strong><span></span></div>');
  const agentStatus = agent.querySelector("span");
  const human = el("div", "ss-human", '<i>TU</i><span>Approvi</span><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5"/></svg>');
  const humanText = human.querySelector("span");

  // Lost cells become rows inside the systems, dealt round-robin so each card holds 4–5.
  const slotOf = new Array(40), cardOf = new Array(40), perCard = SYSTEMS.map(() => 0);
  let rr = 0;
  order.forEach(i => { if (catOf[i] >= 0) { cardOf[i] = rr; slotOf[i] = perCard[rr]++; rr = (rr + 1) % SYSTEMS.length; } });
  const delay = [...Array(40).keys()].map(i => ((i % 8) / 7) * .55 + rand() * .45);

  // ---------- Math helpers ----------
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, [a, b]) => clamp((p - a) / (b - a));
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  const frac = v => v - Math.floor(v);
  const stag = (t, d) => ease(clamp((t - d * .4) / .6));

  // ---------- Layout (recomputed on resize) ----------
  let L = null;
  function layout() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W || !H) return;
    const narrow = W < 520;
    const pitch = Math.min((W - (narrow ? 64 : 110)) / 8, H * .5 / 5);
    const cs = pitch * .8, gridW = 7 * pitch + cs, gridH = 4 * pitch + cs;
    const gx = (W - gridW) / 2 + (narrow ? 12 : 16), gy = H * (narrow ? .6 : .6) - gridH / 2;
    const cw = clamp(W * .29, 96, 210), ch = clamp(H * .18, 58, 120);
    const head = Math.max(34, ch * .3), pad = 9, gap = Math.max(2.5, ch * .035);
    const rowH = Math.min(8, (ch - head - pad - 4 * gap) / 5), rowW = cw - 2 * pad;
    L = {W, H, narrow, pitch, cs, gx, gy, cw, ch, head, pad, gap, rowH, rowW,
      hw: clamp(W * .4, 156, 240), hh: 0, aw: clamp(W * .46, 176, 260), ah: clamp(H * .11, 50, 68)};
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    cells.forEach(c => { c.style.width = c.style.height = cs + "px"; });
    cards.forEach(c => { c.style.width = cw + "px"; });
    hub.style.width = L.hw + "px";
    L.hh = hub.offsetHeight;
    agent.style.width = L.aw + "px"; agent.style.height = L.ah + "px";
    dayLabels.forEach((d, r) => { d.style.transform = `translate(${gx - (narrow ? 30 : 38)}px,${gy + r * pitch + cs / 2 - 5}px)`; });
    hourLabels.forEach((h, c) => { h.style.transform = `translate(${gx + c * pitch + cs / 2 - 6}px,${gy - 20}px)`; });
    counter.style.transform = `translate(${narrow ? 18 : 30}px,${narrow ? 18 : 30}px)`;
    // The approval gate sits on the path between the agent and the systems it acts on.
    const humanW = human.offsetWidth || 120, humanH = human.offsetHeight || 34;
    const gateY = (AGENT[1] * H + L.ah / 2 + HUB[1] * H - L.hh / 2) / 2;
    human.style.left = `${W / 2 - humanW / 2}px`;
    human.style.top = `${gateY - humanH / 2}px`;
    last = -1;
  }

  // Card pose at the current progress: scattered and tilted, then aligned around the hub.
  function cardPose(i, p) {
    const s = SYSTEMS[i], a = ease(seg(p, ALIGN));
    return {x: lerp(s.b[0], s.c[0], a) * L.W, y: lerp(s.b[1], s.c[1], a) * L.H, r: lerp(s.b[2], 0, a)};
  }
  function rowCorner(pose, slot) {
    const rad = pose.r * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
    const lx = L.pad - L.cw / 2, ly = L.head + slot * (L.rowH + L.gap) - pose.h / 2;
    return [pose.x + lx * cos - ly * sin, pose.y + lx * sin + ly * cos];
  }
  const quad = (a, b, bend) => {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
    return {ax: a.x, ay: a.y, cx: mx - dy * bend, cy: my + dx * bend, bx: b.x, by: b.y};
  };
  const qPoint = (q, t) => [(1 - t) * (1 - t) * q.ax + 2 * (1 - t) * t * q.cx + t * t * q.bx, (1 - t) * (1 - t) * q.ay + 2 * (1 - t) * t * q.cy + t * t * q.by];
  const setOpacity = (n, v) => { const s = v.toFixed(3); if (n._o !== s) { n._o = s; n.style.opacity = s; } };
  const toggle = (n, cls, on) => { if (n.classList.contains(cls) !== on) n.classList.toggle(cls, on); };

  // ---------- Render ----------
  let last = -1, sceneNow = -1, stepIdx = -2;
  function render(p) {
    if (!L || p === last) return;
    last = p;
    const morph = seg(p, MORPH), merge = ease(seg(p, MERGE));
    const cardH = lerp(L.ch, L.head + L.rowH + L.pad + 4, merge);
    const poses = SYSTEMS.map((_, i) => ({...cardPose(i, p), h: cardH}));

    // Scene index and rail
    let sc = 0;
    SCENE_START.forEach((s, i) => { if (p >= s) sc = i; });
    if (sc !== sceneNow) {
      sceneNow = sc;
      scenes.forEach((s, i) => { toggle(s, "is-active", i === sc); toggle(s, "is-past", i < sc); });
      railItems.forEach((r, i) => toggle(r, "is-on", i <= sc));
    }
    railFills.forEach((b, i) => { const v = seg(p, RAIL[i]).toFixed(3); if (b._v !== v) { b._v = v; b.style.transform = `scaleX(${v})`; } });

    // Scene 1: categories fill one after another; the counter follows the filled cells.
    let lost = 0;
    const catCount = [0, 0, 0, 0];
    cells.forEach((c, i) => {
      const cat = catOf[i];
      let on = false;
      if (cat >= 0) {
        const w = CAT_WINDOWS[cat], rank = catCount[cat]++;
        on = p >= w[0] + (w[1] - w[0]) * (rank / CATS[cat]);
        if (on) lost++;
      }
      toggle(c, "is-on", on);
      toggle(c, "is-sync", cat >= 0 && merge > .5);
      const t = stag(morph, delay[i]);
      const gx = L.gx + (i % 8) * L.pitch, gy = L.gy + Math.floor(i / 8) * L.pitch;
      if (cat < 0) {
        c.style.transform = `translate(${gx}px,${gy}px) scale(${lerp(1, .55, t)})`;
        setOpacity(c, 1 - t);
        return;
      }
      const slot = lerp(slotOf[i], 0, merge);
      const [rx, ry] = rowCorner(poses[cardOf[i]], slot);
      const x = lerp(gx, rx, t), y = lerp(gy, ry, t), r = lerp(0, poses[cardOf[i]].r, t);
      const sx = lerp(1, L.rowW / L.cs, t), sy = lerp(1, L.rowH / L.cs, t);
      c.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
      setOpacity(c, 1);
    });
    const free = 40 - lost;
    if (counterNum._v !== free) { counterNum._v = free; counterNum.textContent = free; }
    setOpacity(counter, 1 - seg(p, [.25, .3]));
    legend.forEach((li, i) => toggle(li, "is-on", p >= CAT_WINDOWS[i][0]));
    const labelsOp = 1 - clamp(morph * 3);
    dayLabels.forEach(d => setOpacity(d, labelsOp));
    hourLabels.forEach(h => setOpacity(h, labelsOp));

    // Scene 2: systems appear, copies travel by hand between them.
    const cardIn = ease(seg(p, [.265, .33]));
    cards.forEach((c, i) => {
      const o = poses[i];
      const hs = cardH.toFixed(1) + "px";
      if (c.style.height !== hs) c.style.height = hs;
      c.style.transform = `translate(${(o.x - L.cw / 2).toFixed(2)}px,${(o.y - cardH / 2).toFixed(2)}px) rotate(${o.r.toFixed(2)}deg) scale(${lerp(.9, 1, cardIn).toFixed(4)})`;
      setOpacity(c, cardIn);
      toggle(c, "is-linked", p >= LINKS[0] + .03);
    });
    const manualOp = seg(p, MANUAL_IN) * (1 - seg(p, MANUAL_OUT));
    MANUAL.forEach(([a, b], i) => {
      const path = manualPaths[i], pk = packets[i];
      setOpacity(path, manualOp * .9);
      setOpacity(pk, manualOp);
      if (manualOp <= 0) return;
      const q = quad(poses[a], poses[b], i % 2 ? .22 : -.22);
      path.setAttribute("d", `M${q.ax},${q.ay}Q${q.cx},${q.cy} ${q.bx},${q.by}`);
      const [px, py] = qPoint(q, frac((p - MANUAL_IN[0]) * 5 + i * .37));
      pk.setAttribute("x", (px - 3.5).toFixed(1));
      pk.setAttribute("y", (py - 3.5).toFixed(1));
    });

    // Scene 3: one architecture. Hub in the middle, links drawn, duplicate rows merge into one.
    const hubIn = ease(seg(p, HUB_IN));
    const hx = HUB[0] * L.W, hy = HUB[1] * L.H;
    hub.style.transform = `translate(${hx - L.hw / 2}px,${hy - L.hh / 2}px) scale(${lerp(.86, 1, hubIn).toFixed(4)})`;
    setOpacity(hub, hubIn);
    const draw = seg(p, LINKS);
    const st = p >= STEPS[0] ? Math.min(5, Math.floor(seg(p, STEPS) * 6)) : -1;
    const hot = st >= 0 ? STEP_TOOLS[st] : [];
    SYSTEMS.forEach((_, i) => {
      const path = linkPaths[i], o = poses[i];
      const len = Math.hypot(o.x - hx, o.y - hy);
      const d = clamp((draw - i * .08) / .68);
      path.setAttribute("d", `M${hx.toFixed(1)},${hy.toFixed(1)}L${o.x.toFixed(1)},${o.y.toFixed(1)}`);
      path.style.strokeDasharray = `${len.toFixed(1)} ${len.toFixed(1)}`;
      path.style.strokeDashoffset = (len * (1 - d)).toFixed(1);
      const isHot = hot.includes(i);
      toggle(path, "is-hot", isHot);
      toggle(cards[i], "is-hot", isHot);
      const pulse = pulses[i];
      toggle(pulse, "is-hot", isHot);
      const pulseOp = d >= 1 ? (p < AGENT_IN[0] ? 1 : isHot ? 1 : 0) : 0;
      setOpacity(pulse, pulseOp);
      if (pulseOp) {
        const t = frac((p - LINKS[1]) * (isHot ? 14 : 6) + i * .21);
        pulse.setAttribute("cx", lerp(hx, o.x, t).toFixed(1));
        pulse.setAttribute("cy", lerp(hy, o.y, t).toFixed(1));
      }
    });

    // Scene 4: the agent sits on top of the architecture and works through it.
    const agentIn = ease(seg(p, AGENT_IN));
    const ax = AGENT[0] * L.W, ay = AGENT[1] * L.H;
    agent.style.transform = `translate(${ax - L.aw / 2}px,${(ay - L.ah / 2 + (1 - agentIn) * 14).toFixed(2)}px)`;
    setOpacity(agent, agentIn);
    const alen = Math.max(0, hy - L.hh / 2 - (ay + L.ah / 2));
    agentPath.setAttribute("d", `M${ax},${ay + L.ah / 2}L${hx},${hy - L.hh / 2}`);
    agentPath.style.strokeDasharray = `${alen} ${alen}`;
    agentPath.style.strokeDashoffset = (alen * (1 - seg(p, AGENT_LINK))).toFixed(1);
    toggle(agentPath, "is-hot", st >= 0 && st < 5);
    const apOp = st >= 1 && st <= 4 ? 1 : 0;
    setOpacity(agentPulse, apOp);
    if (apOp) {
      const t = frac(p * 22);
      agentPulse.setAttribute("cx", ax);
      agentPulse.setAttribute("cy", (lerp(ay + L.ah / 2, hy - L.hh / 2, t)).toFixed(1));
    }
    toggle(human, "is-on", st >= 4);
    toggle(human, "is-ok", st >= 5);

    if (st !== stepIdx) {
      stepIdx = st;
      steps.forEach((s, i) => { toggle(s, "is-active", i === st); toggle(s, "is-done", i < st); });
      agentStatus.textContent = AGENT_STATUS[Math.max(0, st)];
      humanText.textContent = st >= 5 ? "Approvato" : "Approvi";
      cardTags.forEach((t, i) => { t.textContent = st >= 5 && i === 4 ? "inviata" : st >= 5 && i === 0 ? "registrata" : p >= LINKS[0] + .03 ? "collegato" : "a mano"; });
      if (stepNow) {
        const s = steps[Math.max(0, st)];
        stepNow.innerHTML = `<b>${s.querySelector("b").textContent}</b>${s.querySelector("span").textContent}`;
      }
    }
    if (st < 0) cardTags.forEach(t => { const v = p >= LINKS[0] + .03 ? "collegato" : "a mano"; if (t.textContent !== v) t.textContent = v; });
  }

  // ---------- Scroll → progress, with exponential smoothing ----------
  // Reduced motion: no smoothing and progress snaps to each scene's settled state.
  const SNAP = [.235, .49, .735, 1];
  let target = 0, current = 0, raf = 0, prevT = 0;
  function measure() {
    const r = root.getBoundingClientRect();
    const total = root.offsetHeight - stage.offsetHeight;
    let p = total > 0 ? clamp(-r.top / total) : 0;
    if (reduced.matches) {
      let sc = 0;
      SCENE_START.forEach((s, i) => { if (p >= s) sc = i; });
      p = SNAP[sc];
    }
    return p;
  }
  function tick(t) {
    raf = 0;
    const dt = prevT ? Math.min(64, t - prevT) : 16;
    prevT = t;
    if (reduced.matches) current = target;
    else {
      current += (target - current) * (1 - Math.exp(-dt / 95));
      if (Math.abs(target - current) < .0005) current = target;
    }
    render(current);
    if (current !== target) raf = requestAnimationFrame(tick);
    else prevT = 0;
  }
  function update() {
    target = measure();
    if (!raf) raf = requestAnimationFrame(tick);
  }

  let near = false;
  new IntersectionObserver(entries => {
    near = entries[0].isIntersecting;
    update();
  }, {rootMargin: "50% 0px 50% 0px"}).observe(root);
  addEventListener("scroll", () => { if (near) update(); }, {passive: true});
  new ResizeObserver(() => { layout(); update(); }).observe(canvas);
  reduced.addEventListener?.("change", () => { last = -1; update(); });

  layout();
  target = current = measure();
  render(current);
  root.classList.add("ss-live");
})();
