(function () {
  document.documentElement.classList.add("js");

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  const homeHero = document.querySelector(".hero");

  const applyNav = () => {
    if (!nav) return;
    if (homeHero) nav.classList.toggle("is-solid", window.scrollY > 24);
  };
  applyNav();
  window.addEventListener("scroll", applyNav, { passive: true });

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const form = document.querySelector("form[name='contacto']");
  if (form) {
    form.addEventListener("submit", () => {
      const btn = form.querySelector("button[type='submit']");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Enviando…";
      }
    });
  }

  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("is-in");
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        )
      : null;

  document.querySelectorAll(".inview").forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
    if (io) io.observe(el);
    else el.classList.add("is-in");
  });

  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = el.getAttribute("data-count");
    const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    const suffix = String(target).replace(/[0-9.]/g, "");
    if (!io || Number.isNaN(numeric)) {
      el.textContent = target;
      return;
    }
    const run = () => {
      const start = performance.now();
      const dur = 1100;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = numeric * eased;
        el.textContent =
          (numeric >= 100 ? Math.round(val).toLocaleString("es-PE") : val.toFixed(numeric % 1 ? 1 : 0)) +
          suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        run();
        obs.disconnect();
      }
    });
    obs.observe(el);
  });

  const sysNav = document.querySelector(".sys-nav");
  if (sysNav && "IntersectionObserver" in window) {
    const map = new Map();
    sysNav.querySelectorAll("a[href^='#']").forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            sysNav.querySelectorAll("a").forEach((a) => a.classList.remove("is-on"));
            const link = map.get(e.target);
            if (link) link.classList.add("is-on");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    map.forEach((_, sec) => spy.observe(sec));
  }
})();