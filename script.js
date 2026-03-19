// script.js — v5
(function(){
  lucide.createIcons();
  const yr = document.getElementById("year");
  if(yr) yr.textContent = new Date().getFullYear();

  // Scroll progress
  const bar = document.getElementById("scrollProg");
  function updateBar(){
    if(!bar) return;
    const p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    bar.style.transform = "scaleX(" + Math.min(1,p) + ")";
  }
  window.addEventListener("scroll", updateBar, {passive:true});
  updateBar();

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const menu   = document.querySelector("#navMenu");
  function closeMenu(){
    if(!menu || !menu.classList.contains("open")) return;
    menu.classList.remove("open");
    toggle?.setAttribute("aria-expanded","false");
  }
  if(toggle && menu){
    toggle.addEventListener("click", ()=>{
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
    document.addEventListener("click", e=>{
      if(!menu.classList.contains("open")) return;
      if(!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver(
    e => e.forEach(x => x.isIntersecting && x.target.classList.add("in")),
    {threshold: .08}
  );
  document.querySelectorAll(".rev").forEach(el => io.observe(el));

  // Active nav spy
  const navLinks = document.querySelectorAll(".nav-link");
  const ids = ["home","about","usp","education","skills","experience","services","packages","certificates","testimonials","cta"];
  const spy = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      navLinks.forEach(l=>{ l.classList.remove("active"); l.removeAttribute("aria-current"); });
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if(a){ a.classList.add("active"); a.setAttribute("aria-current","page"); }
    });
  },{rootMargin:"-40% 0px -55% 0px"});
  ids.map(id=>document.getElementById(id)).filter(Boolean).forEach(s=>spy.observe(s));

  // Subtle tilt
  const canTilt = window.matchMedia("(pointer:fine)").matches;
  if(canTilt){
    document.querySelectorAll(".usp-card,.sk-card,.exp-card,.proj-card,.svc-card,.pkg-card,.cert-card,.test,.cta-card").forEach(card=>{
      card.addEventListener("mousemove", e=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform = `translateY(-2px) perspective(900px) rotateY(${x*3.5}deg) rotateX(${-y*3.5}deg)`;
      });
      card.addEventListener("mouseleave", ()=>{ card.style.transform = ""; });
    });
  }

  // Copy email
  async function copy(t){
    if(navigator.clipboard) return navigator.clipboard.writeText(t);
    const ta=document.createElement("textarea"); ta.value=t;
    ta.style.cssText="position:fixed;left:-9999px"; document.body.appendChild(ta);
    ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
  }
  const copyBtn = document.getElementById("copyEmail");
  if(copyBtn){
    copyBtn.addEventListener("click", async()=>{
      try{
        await copy("mohamedalaah5ss@gmail.com");
        const m = document.getElementById("copyMsg");
        if(m){ m.classList.remove("hidden"); setTimeout(()=>m.classList.add("hidden"),1800); }
      }catch(_){}
    });
  }

  // Projects modal
  const projects = {
    etl:{
      title:"End-to-End ETL Pipeline", subtitle:"Ingest → Validate → Transform → Load",
      desc:"A complete pipeline workflow: raw inputs → validation rules → clean schema → analytics-ready tables. Built with reproducibility and maintainability as first-class constraints.",
      stack:["Python","SQL","ETL/ELT","Validation","Logging","Git"],
      highlights:[
        "Designed a clean target schema for reporting and consistent KPIs.",
        "Validation checks catch bad inputs early — before they corrupt downstream data.",
        "Structured logs make every run debuggable and auditable.",
        "Full documentation allows anyone to operate the pipeline from day one."
      ],
      repo:"https://github.com/mohamedalaah5ss-oss", docs:"https://github.com/mohamedalaah5ss-oss"
    },
    model:{
      title:"Analytics Data Model", subtitle:"Star schema + metric consistency",
      desc:"A data modeling case study: fact/dimension tables, clear metric definitions, naming standards, and query-performance-aware design — so dashboards stay consistent at scale.",
      stack:["SQL","Star Schema","Dimensions/Facts","KPI Definitions"],
      highlights:[
        "Star schema supports consistent KPIs across all reports.",
        "Clear naming standards and inline documentation.",
        "Optimised for fast analytics queries with minimal joins."
      ],
      repo:"https://github.com/mohamedalaah5ss-oss", docs:"https://github.com/mohamedalaah5ss-oss"
    },
    quality:{
      title:"Data Quality System", subtitle:"Validation + structured logging",
      desc:"A lightweight quality layer: reusable validation rules, structured error output, and run logs — so failures surface fast and pipelines become trustworthy.",
      stack:["Python","Validation Rules","Structured Logging","Data Quality"],
      highlights:[
        "Reusable checks for the most common data issues.",
        "Standardised error messages to speed up troubleshooting.",
        "Makes pipeline runs predictable and easy to audit."
      ],
      repo:"https://github.com/mohamedalaah5ss-oss", docs:"https://github.com/mohamedalaah5ss-oss"
    }
  };

  const modal   = document.getElementById("projectModal");
  const closeBtn= document.getElementById("closeModal");
  const titleEl = document.getElementById("projectTitle");
  const subEl   = document.getElementById("projectSubtitle");
  const descEl  = document.getElementById("projectDesc");
  const stackEl = document.getElementById("projectStack");
  const hilEl   = document.getElementById("projectHighlights");
  const repoEl  = document.getElementById("projectRepo");
  const docsEl  = document.getElementById("projectDocs");
  let lastFocus = null;

  function openModal(key){
    const p = projects[key]; if(!p || !modal) return;
    lastFocus = document.activeElement;
    titleEl.textContent = p.title; subEl.textContent = p.subtitle; descEl.textContent = p.desc;
    stackEl.innerHTML = "";
    p.stack.forEach(s=>{ const sp=document.createElement("span"); sp.className="sp"; sp.textContent=s; stackEl.appendChild(sp); });
    hilEl.innerHTML = "";
    p.highlights.forEach(h=>{
      const li=document.createElement("li");
      li.style.cssText="display:flex;align-items:flex-start;gap:7px";
      li.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-top:3px;flex-shrink:0"><polyline points="9 18 15 12 9 6"></polyline></svg><span>${h}</span>`;
      hilEl.appendChild(li);
    });
    repoEl.href = p.repo; docsEl.href = p.docs;
    modal.classList.remove("hidden");
    document.body.style.overflow="hidden";
    closeBtn.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow="";
    lastFocus?.focus?.();
  }
  document.querySelectorAll(".proj-card").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.project)));
  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", e=>{ if(e.target.dataset.close==="true") closeModal(); });
  document.addEventListener("keydown", e=>{ if(!modal?.classList.contains("hidden") && e.key==="Escape") closeModal(); });
})();
