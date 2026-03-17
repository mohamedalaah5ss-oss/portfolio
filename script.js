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

  // Projects modal
  const projects = {
    aiPrompts: {
      title: "كتابة برومبتات احترافية للذكاء الاصطناعي — ChatGPT | Midjourney | Gemini",
      subtitle: "Professional AI prompt writing service",
      desc:
        "A real freelance project centered on writing professional prompts for major AI tools and presenting the service in a polished, client-ready way.",
      stack: ["AI", "Prompt Writing", "ChatGPT", "Midjourney", "Gemini"],
      highlights: [
        "Prepared prompt ideas in a format that feels practical and easy for clients to use.",
        "Positioned the service around multiple AI tools instead of only one platform.",
        "Suitable for adding a marketplace screenshot or service banner as the main project image."
      ],
      visualLabel: "Add your AI prompts project image here"
    },
    bilingualCv: {
      title: "كتابة سيرتك الذاتية بإحدى اللغتين العربية والانجليزية",
      subtitle: "Arabic / English resume writing and formatting",
      desc:
        "A real freelance project focused on writing and formatting professional resumes in either Arabic or English with a clean, presentable output.",
      stack: ["Resume Writing", "CV Design", "Arabic", "English", "Formatting"],
      highlights: [
        "Built around clear resume structure and polished written presentation.",
        "Easy to showcase with a before-and-after CV sample or marketplace screenshot.",
        "Fits naturally inside the portfolio as a real writing and delivery project."
      ],
      visualLabel: "Add your resume writing project image here"
    }
  };

  const modal = document.getElementById("projectModal");
  const closeBtn = document.getElementById("closeModal");
  const titleEl = document.getElementById("projectTitle");
  const subEl = document.getElementById("projectSubtitle");
  const descEl = document.getElementById("projectDesc");
  const visualEl = document.getElementById("projectVisual");
  const stackEl = document.getElementById("projectStack");
  const highlightsEl = document.getElementById("projectHighlights");

  let lastFocus = null;

  function openModal(key) {
    const p = projects[key];
    if (!p || !modal) return;

    lastFocus = document.activeElement;

    titleEl.textContent = p.title;
    subEl.textContent = p.subtitle;
    descEl.textContent = p.desc;
    if (visualEl) visualEl.textContent = p.visualLabel || "Add project image here later";

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
