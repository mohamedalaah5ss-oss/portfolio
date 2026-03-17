// script.js — v2
(function () {
  lucide.createIcons();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ── Scroll progress bar ──
  const bar = document.getElementById("scrollProgress");
  if (bar) {
    function updateBar() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (scrolled / total) + ")";
    }
    window.addEventListener("scroll", updateBar, { passive: true });
    updateBar();
  }

  // ── Mobile nav ──
  const toggleBtn = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#navMenu");
  function closeMenu() {
    if (!menu || !toggleBtn) return;
    if (!menu.classList.contains("open")) return;
    menu.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }
  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      const t = e.target;
      if (t instanceof Node && !menu.contains(t) && !toggleBtn.contains(t)) closeMenu();
    });
  }

  // ── Reveal on scroll ──
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.10 }
  );
  reveals.forEach((el) => io.observe(el));

  // ── Active nav spy ──
  const links = document.querySelectorAll(".nav-link");
  const ids = ["home","about","usp","education","skills","experience","services","packages","certificates","testimonials","cta"];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => { l.classList.remove("active"); l.removeAttribute("aria-current"); });
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) { active.classList.add("active"); active.setAttribute("aria-current", "page"); }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // ── Copy email ──
  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  const copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await copyText("mohamedalaah5ss@gmail.com");
        const msg = document.getElementById("copyMsg");
        if (msg) { msg.classList.remove("hidden"); setTimeout(() => msg.classList.add("hidden"), 1500); }
      } catch (_) {}
    });
  }

  // ── Cursor glow ──
  const glow = document.getElementById("cursorGlow");
  let mx = 0, my = 0, raf = 0;
  function paint() {
    raf = 0;
    if (!glow) return;
    glow.style.left = mx + "px";
    glow.style.top = my + "px";
  }
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(paint);
  }, { passive: true });

  // ── 3D Tilt ──
  const tilts = document.querySelectorAll(".tilt");
  const canTilt = window.matchMedia("(pointer:fine)").matches;
  if (canTilt) {
    tilts.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  // ── Projects Modal ──
  const projects = {
    etl: {
      title: "End-to-End ETL Pipeline",
      subtitle: "Ingest → Validate → Transform → Load",
      desc: "A complete pipeline workflow that takes raw inputs, applies validation rules, transforms data into a clean schema, and loads analytics-ready tables. Built with reproducibility and maintainability in mind.",
      stack: ["Python", "SQL", "ETL/ELT", "Validation", "Logging", "Git"],
      highlights: [
        "Designed a clean target schema for reporting and consistent KPIs.",
        "Added validation checks to catch bad inputs early.",
        "Used structured logs to make debugging predictable and fast.",
        "Documented run steps and assumptions for easy handoff."
      ],
      repo: "https://github.com/mohamedalaah5ss-oss",
      docs: "https://github.com/mohamedalaah5ss-oss"
    },
    model: {
      title: "Analytics Data Model",
      subtitle: "Star schema + metric consistency",
      desc: "A modeling case study focused on building fact/dimension tables with clear definitions, naming standards, and query performance in mind—so dashboards stay consistent and scalable.",
      stack: ["SQL", "Star Schema", "Dimensions/Facts", "KPI Definitions"],
      highlights: [
        "Built a model that supports consistent KPIs across reports.",
        "Used clear naming standards and documentation for maintainability.",
        "Optimized for fast analytics queries with sane joins."
      ],
      repo: "https://github.com/mohamedalaah5ss-oss",
      docs: "https://github.com/mohamedalaah5ss-oss"
    },
    quality: {
      title: "Data Quality Mini-System",
      subtitle: "Checks + logs for stable pipelines",
      desc: "A lightweight quality layer that applies validation rules, surfaces errors clearly, and creates structured logs—reducing silent failures and improving trust in the data output.",
      stack: ["Python", "Validation Rules", "Structured Logging", "Data Quality"],
      highlights: [
        "Implemented reusable checks for common data issues.",
        "Standardized error messages to speed up troubleshooting.",
        "Made pipeline runs more predictable and easier to audit."
      ],
      repo: "https://github.com/mohamedalaah5ss-oss",
      docs: "https://github.com/mohamedalaah5ss-oss"
    }
  };

  const modal = document.getElementById("projectModal");
  const closeBtn = document.getElementById("closeModal");
  const titleEl = document.getElementById("projectTitle");
  const subEl = document.getElementById("projectSubtitle");
  const descEl = document.getElementById("projectDesc");
  const stackEl = document.getElementById("projectStack");
  const highlightsEl = document.getElementById("projectHighlights");
  const repoEl = document.getElementById("projectRepo");
  const docsEl = document.getElementById("projectDocs");
  let lastFocus = null;

  function openModal(key) {
    const p = projects[key];
    if (!p || !modal) return;
    lastFocus = document.activeElement;
    titleEl.textContent = p.title;
    subEl.textContent = p.subtitle;
    descEl.textContent = p.desc;
    stackEl.innerHTML = "";
    p.stack.forEach((s) => {
      const span = document.createElement("span");
      span.className = "skill-tag";
      span.textContent = s;
      stackEl.appendChild(span);
    });
    highlightsEl.innerHTML = "";
    p.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.style.cssText = "display:flex;align-items:flex-start;gap:8px";
      li.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-top:3px;flex-shrink:0"><polyline points="9 18 15 12 9 6"></polyline></svg><span>${h}</span>`;
      highlightsEl.appendChild(li);
    });
    repoEl.href = p.repo;
    docsEl.href = p.docs;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.querySelectorAll(".project-card").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.getAttribute("data-project")));
  });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement && e.target.dataset.close === "true") closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("hidden") && e.key === "Escape") closeModal();
    });
  }
})();
