(() => {
  "use strict";
  const host = document.querySelector("[data-live-services]");
  if (!host) return;

  // All eight miniature interfaces are original DOM/CSS compositions: no photos,
  // emoji, stock renders, external libraries or clickable cards.
  const chrome = (app, meta) => '<div class="demo-chrome"><span class="demo-dots"><i></i><i></i><i></i></span><span>' + app + '</span><span class="demo-chrome-right">' + meta + '</span></div>';
  const scenes = [
    {
      kicker: "PRODUCT DEVELOPMENT", name: "MVP e prototipi",
      description: "Dall'idea alla prima versione funzionante", style: "cream",
      html: chrome("studio / product", "preview") +
      '<div class="demo-mvp"><div class="mvp-overline">EARLY ACCESS <b class="tiny-online"></b></div>' +
      '<strong>Un prodotto.<br>Già reale.</strong><div class="mvp-ui-preview"><div class="mvp-mini-label">Onboarding flow</div>' +
      '<div class="mvp-steps"><span class="is-done">01</span><i></i><span class="is-done">02</span><i></i><span data-stage-cell>03</span></div>' +
      '<div class="mvp-progress"><span data-progress-fill></span></div><div class="mvp-bottom"><span>Pronto per il test</span><b data-live-percent>78%</b></div></div></div>'
    },
    {
      kicker: "WEB PLATFORMS", name: "Piattaforme SaaS",
      description: "Dashboard, dati e processi in un solo posto", style: "ink",
      html: chrome("workspace", "live") +
      '<div class="demo-saas"><aside class="saas-nav"><span class="saas-mark">S</span><i class="active"></i><i></i><i></i><i></i><small>◯</small></aside>' +
      '<div class="saas-content"><span class="mini-heading">Overview <b>•••</b></span><div class="saas-metric"><small>Activity this week</small>' +
      '<strong data-live-count>1,248</strong><span>↗ +12.6%</span></div>' +
      '<div class="saas-chart"><i style="--h:34%;--d:0s"></i><i style="--h:61%;--d:.2s"></i><i style="--h:47%;--d:.4s"></i><i style="--h:75%;--d:.6s"></i><i style="--h:54%;--d:.8s"></i><i style="--h:90%;--d:1s"></i><i style="--h:72%;--d:1.2s"></i></div>' +
      '<div class="saas-legend"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div></div></div>'
    },
    {
      kicker: "SOFTWARE ARCHITECTURE", name: "Backend e API",
      description: "Sistemi che comunicano in modo affidabile", style: "slate",
      html: chrome("terminal / api", "v1.0") +
      '<div class="demo-api"><div class="api-request"><span class="api-method">POST</span><span>/api/v1/orders</span><b class="api-code">200 OK</b></div>' +
      '<div class="api-codebox"><div><small>01</small> <span class="code-purple">const</span> response = <span class="code-blue">await</span></div>' +
      '<div><small>02</small> api.<span class="code-gold">createOrder</span>({</div><div><small>03</small> &nbsp; status: <span class="code-gold">"success"</span>,</div>' +
      '<div><small>04</small> &nbsp; id: <span data-live-id>1024</span></div><div><small>05</small> });</div></div>' +
      '<div class="api-feed"><span class="api-flash"></span><span>Response received</span><b data-live-ms>42ms</b></div></div>'
    },
    {
      kicker: "DOCUMENT AUTOMATION", name: "Document Intelligence",
      description: "Dai documenti ai dati utilizzabili", style: "ivory",
      html: chrome("extract / document", "pdf") +
      '<div class="demo-doc"><div class="doc-sheet"><div class="doc-top">FATTURA <span>2026/017</span></div><i class="doc-line w85"></i><i class="doc-line w60"></i>' +
      '<i class="doc-line w75"></i><div class="doc-highlight"></div><i class="doc-line w50"></i><div class="doc-scan"></div></div>' +
      '<div class="doc-result"><div class="doc-result-head"><span>ESTRAZIONE</span><b class="doc-ok">✓</b></div>' +
      '<small>Fornitore</small><strong>Acme S.r.l.</strong><small>Totale</small><strong>€ 1.240,00</strong><small>Confidenza</small>' +
      '<div class="doc-confidence"><span></span><b data-live-confidence>98%</b></div></div></div>'
    },
    {
      kicker: "AGENTIC AI", name: "Agenti AI e copiloti",
      description: "AI che utilizza davvero i tuoi strumenti", style: "rosy",
      html: chrome("orchestrator / tools", "online") +
      '<div class="demo-agents"><div class="agent-request"><span class="agent-avatar">U</span><span>Controlla le disponibilità</span></div>' +
      '<div class="agent-flow"><div class="agent-line"></div><div class="agent-node agent-llm"><span>AI</span><small>Reasoning</small></div>' +
      '<div class="agent-node agent-tool"><span>API</span><small>Calendario</small></div><div class="agent-node agent-done"><span>✓</span><small>Risposta</small></div></div>' +
      '<div class="agent-status"><span class="tiny-online"></span><span data-live-agent>Strumenti sincronizzati</span></div></div>'
    },
    {
      kicker: "CLOUD INFRASTRUCTURE", name: "Cloud e deployment",
      description: "Dal codice a un servizio disponibile", style: "midnight",
      html: chrome("pipeline / main", "CI/CD") +
      '<div class="demo-cloud"><div class="cloud-branch"><span>⌁</span> release/production <b class="cloud-dot"></b></div>' +
      '<div class="cloud-pipeline"><div class="cloud-step"><span class="cloud-step-top"><b>01</b><i></i></span><strong>Commit</strong><small>Passed</small></div>' +
      '<div class="cloud-step"><span class="cloud-step-top"><b>02</b><i></i></span><strong>Build</strong><small>Passed</small></div>' +
      '<div class="cloud-step"><span class="cloud-step-top"><b>03</b><i></i></span><strong>Deploy</strong><small data-live-cloud>Live</small></div></div>' +
      '<div class="cloud-footer"><span class="tiny-online"></span> Production healthy <b data-live-uptime>99.9%</b></div></div>'
    },
    {
      kicker: "MODERNIZATION", name: "Evoluzione del software",
      description: "Software più pulito, veloce, mantenibile", style: "sandstone",
      html: chrome("refactor / diff", "compare") +
      '<div class="demo-evolve"><div class="evolve-title">Refactoring <span data-live-version>v2.4</span></div>' +
      '<div class="evolve-diff"><div class="diff-row removed"><b>−</b><span>legacy.process(data)</span></div>' +
      '<div class="diff-row added"><b>+</b><span>service.validate(data)</span></div>' +
      '<div class="diff-row added"><b>+</b><span>await queue.dispatch()</span></div><div class="diff-row neutral"><b>··</b><span>return result.ok</span></div></div>' +
      '<div class="evolve-metrics"><div><strong>−32%</strong><small>complexity</small></div><div><strong>+48%</strong><small>coverage</small></div></div></div>'
    },
    {
      kicker: "TECHNICAL PARTNERSHIP", name: "Direzione tecnica",
      description: "Visione, architettura e decisioni concrete", style: "deep",
      html: chrome("architecture / map", "strategy") +
      '<div class="demo-architecture"><div class="arch-status">SYSTEM DESIGN <span class="tiny-online"></span></div>' +
      '<div class="arch-system"><div class="arch-connector vertical"></div><div class="arch-connect horizontal"></div>' +
      '<div class="arch-node arch-main">PRODUCT<small>Core</small></div>' +
      '<div class="arch-node arch-left">CLIENT<small>Web</small></div><div class="arch-node arch-right">DATA<small>Store</small></div>' +
      '<div class="arch-node arch-bottom">AI / API<small>Integrations</small></div></div>' +
      '<div class="arch-footer"><span>Scalable by design</span><b data-live-arch>READY</b></div></div>'
    }
  ];

  function card(scene, index) {
    const article = document.createElement("article");
    article.className = "live-card theme-" + scene.style;
    article.dataset.demo = String(index);
    article.setAttribute("aria-label", scene.name + ". " + scene.description + ".");
    article.innerHTML =
      '<div class="live-scene" aria-hidden="true">' + scene.html + '</div>' +
      '<div class="live-caption"><span class="live-kicker">' + String(index + 1).padStart(2, "0") +
      ' / ' + scene.kicker + '</span><h3>' + scene.name + '</h3><p>' + scene.description + '</p></div>';
    return article;
  }

  const rail = document.createElement("div");
  rail.className = "live-rail";
  for (let groupIndex = 0; groupIndex < 2; groupIndex++) {
    const group = document.createElement("div");
    group.className = "live-group";
    if (groupIndex === 1) {
      group.setAttribute("aria-hidden", "true");
      group.setAttribute("inert", "");
    }
    scenes.forEach((scene, i) => group.appendChild(card(scene, i)));
    rail.appendChild(group);
  }
  host.replaceChildren(rail);

  // Live values are demo data, deliberately illustrative rather than real metrics.
  let frame = 0;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
    }, {threshold: 0.05});
    observer.observe(host);
  }
  const update = () => {
    if (reduced.matches || !visible || document.hidden) return;
    frame = (frame + 1) % 6;
    host.querySelectorAll("[data-demo]").forEach(card => {
      card.dataset.phase = String(frame % 3);
      const set = (selector, value) => {
        const el = card.querySelector(selector);
        if (el) el.textContent = value;
      };
      const progress = card.querySelector("[data-progress-fill]");
      if (progress) progress.style.width = String(68 + frame * 5) + "%";
      set("[data-live-percent]", String(68 + frame * 5) + "%");
      set("[data-live-count]", (1248 + frame * 17).toLocaleString("en-US"));
      set("[data-live-id]", String(1024 + frame));
      set("[data-live-ms]", String(38 + (frame * 7) % 25) + "ms");
      set("[data-live-confidence]", String(96 + frame % 4) + "%");
      set("[data-live-agent]", ["Strumenti sincronizzati","Consultazione completata","Risposta verificata"][frame % 3]);
      set("[data-live-cloud]", ["Live","Healthy","Updated"][frame % 3]);
      set("[data-live-uptime]", ["99.9%","100%","99.9%"][frame % 3]);
      set("[data-live-version]", ["v2.4","v2.5","v2.6"][frame % 3]);
      set("[data-live-arch]", ["READY","VERIFIED","SCALABLE"][frame % 3]);
    });
  };
  if (!reduced.matches) window.setInterval(update, 2600);
})();