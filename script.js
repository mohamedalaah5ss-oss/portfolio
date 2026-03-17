// script.js
(function () {
  lucide.createIcons();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav
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
      if (t instanceof Node) {
        const clickedInside = menu.contains(t) || toggleBtn.contains(t);
        if (!clickedInside) closeMenu();
      }
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));

  // Active link spy
  const links = document.querySelectorAll(".nav-link");
  const ids = ["home", "about", "usp", "education", "skills", "experience", "services", "packages", "certificates", "testimonials", "cta"];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => {
          l.classList.remove("active");
          l.removeAttribute("aria-current");
        });
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add("active");
          active.setAttribute("aria-current", "page");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Copy email
  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
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
        if (msg) {
          msg.classList.remove("hidden");
          setTimeout(() => msg.classList.add("hidden"), 1200);
        }
      } catch (_) {}
    });
  }

  // Cursor glow
  const glow = document.getElementById("cursorGlow");
  let mx = 0, my = 0, raf = 0;

  function paint() {
    raf = 0;
    if (!glow) return;
    glow.style.left = mx + "px";
    glow.style.top = my + "px";
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    },
    { passive: true }
  );

  // Tilt effect
  const tilts = document.querySelectorAll(".tilt");
  const canTilt = window.matchMedia && window.matchMedia("(pointer:fine)").matches;
  if (canTilt) {
    tilts.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${(-y) * 6}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
      });
    });
  }

  // Projects modal (fixes broken project navigation)
  const projects = {
    etl: {
      title: "End-to-End ETL Pipeline",
      subtitle: "Ingest → Validate → Transform → Load",
      desc:
        "A complete pipeline workflow that takes raw inputs, applies validation rules, transforms data into a clean schema, and loads analytics-ready tables. Built with reproducibility and maintainability in mind.",
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
      desc:
        "A modeling case study focused on building fact/dimension tables with clear definitions, naming standards, and query performance in mind—so dashboards stay consistent and scalable.",
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
      desc:
        "A lightweight quality layer that applies validation rules, surfaces errors clearly, and creates structured logs—reducing silent failures and improving trust in the data output.",
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
      span.className = "panel px-3 py-2";
      span.textContent = s;
      stackEl.appendChild(span);
    });

    highlightsEl.innerHTML = "";
    p.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = "• " + h;
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
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.dataset.close === "true") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (modal.classList.contains("hidden")) return;
      if (e.key === "Escape") closeModal();
    });
  }
})();
