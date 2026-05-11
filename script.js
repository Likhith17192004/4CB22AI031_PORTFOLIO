const DATA_URL = "data/profile.json";

function el(id) {
  return document.getElementById(id);
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function safeText(targetEl, value, fallback = "") {
  if (!targetEl) return;
  targetEl.textContent = isNonEmptyString(value) ? value : fallback;
}

function safeHref(anchorEl, href, fallback = "#") {
  if (!anchorEl) return;
  anchorEl.href = isNonEmptyString(href) ? href : fallback;
}

function renderPills(container, items) {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) return;

  for (const raw of items) {
    const label = typeof raw === "string" ? raw : "";
    if (!isNonEmptyString(label)) continue;
    const span = document.createElement("span");
    span.className = "pill";
    span.textContent = label.trim();
    container.appendChild(span);
  }
}

function renderLinks(container, links, className = "") {
  if (!container) return;
  container.innerHTML = "";
  if (!Array.isArray(links) || links.length === 0) return;

  for (const link of links) {
    if (!link || !isNonEmptyString(link.label) || !isNonEmptyString(link.href)) continue;
    const a = document.createElement("a");
    a.textContent = link.label.trim();
    a.href = link.href.trim();
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (className) a.className = className;
    container.appendChild(a);
  }
}

function applyThemeToggle() {
  const darkBtn = el("darkModeBtn");
  if (!darkBtn) return;

  const key = "portfolio.theme";
  const saved = localStorage.getItem(key);
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    darkBtn.setAttribute("aria-pressed", "true");
    darkBtn.textContent = "Light";
  }

  darkBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem(key, isDark ? "dark" : "light");
    darkBtn.setAttribute("aria-pressed", String(isDark));
    darkBtn.textContent = isDark ? "Light" : "Dark";
  });
}

function setDocumentMeta(site) {
  if (!site) return;
  if (isNonEmptyString(site.title)) document.title = site.title.trim();
  const desc = document.querySelector('meta[name="description"]');
  if (desc && isNonEmptyString(site.description)) desc.setAttribute("content", site.description.trim());
}

function renderHero(hero) {
  if (!hero) return;

  safeText(el("heroEyebrow"), hero.eyebrow, "Hi, I’m");
  safeText(el("heroName"), hero.name, "Your Name");
  safeText(el("heroRole"), hero.role, "Your Role");
  safeText(el("heroIntro"), hero.intro, "");

  const primary = el("primaryCta");
  if (primary) {
    safeText(primary, hero.primaryCta?.label, "View Projects");
    safeHref(primary, hero.primaryCta?.href, "#projects");
  }

  const secondary = el("secondaryCta");
  if (secondary) {
    safeText(secondary, hero.secondaryCta?.label, "Contact");
    safeHref(secondary, hero.secondaryCta?.href, "#contact");
  }

  const quickLinks = el("quickLinks");
  if (quickLinks) {
    quickLinks.innerHTML = "";
    if (Array.isArray(hero.quickLinks)) {
      for (const link of hero.quickLinks) {
        if (!link || !isNonEmptyString(link.label) || !isNonEmptyString(link.href)) continue;
        const a = document.createElement("a");
        a.textContent = link.label.trim();
        a.href = link.href.trim();
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        quickLinks.appendChild(a);
      }
    }
  }

  const img = el("profileImage");
  if (img && hero.profileImage) {
    if (isNonEmptyString(hero.profileImage.src)) img.src = hero.profileImage.src.trim();
    if (isNonEmptyString(hero.profileImage.alt)) img.alt = hero.profileImage.alt.trim();
  }
}

function renderAbout(about) {
  if (!about) return;
  const paras = Array.isArray(about.paragraphs) ? about.paragraphs : [];
  safeText(el("aboutParagraph1"), paras[0], "");
  safeText(el("aboutParagraph2"), paras[1], "");
  safeText(el("aboutParagraph3"), paras[2], "");
  safeText(el("aboutParagraph4"), paras[3], "");

  safeText(el("educationTitle"), about.education?.title, "Education");
  safeText(el("educationSchool"), about.education?.school, "");
  safeText(el("educationDetail"), about.education?.detail, "");

  const skillsList = el("skillsList");
  if (skillsList) {
    skillsList.innerHTML = "";
    if (Array.isArray(about.skills)) {
      for (const s of about.skills) {
        if (!isNonEmptyString(s)) continue;
        const span = document.createElement("span");
        span.textContent = s.trim();
        skillsList.appendChild(span);
      }
    }
  }
}

function renderProjects(projects) {
  safeText(el("projectsLead"), projects?.lead, "");
  const grid = el("projectsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const items = Array.isArray(projects?.items) ? projects.items : [];
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "section-lead";
    empty.textContent = "No projects added yet. Update data/profile.json to show your work.";
    grid.appendChild(empty);
    return;
  }

  for (const p of items) {
    if (!p || !isNonEmptyString(p.title) || !isNonEmptyString(p.description)) continue;

    const card = document.createElement("article");
    card.className = "project-card";

    if (p.image?.src) {
      const img = document.createElement("img");
      img.src = String(p.image.src);
      img.alt = isNonEmptyString(p.image.alt) ? p.image.alt.trim() : p.title.trim();
      img.loading = "lazy";
      card.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = p.title.trim();
    card.appendChild(h3);

    const desc = document.createElement("p");
    desc.textContent = p.description.trim();
    card.appendChild(desc);

    if (Array.isArray(p.tech) && p.tech.length > 0) {
      const meta = document.createElement("div");
      meta.className = "project-meta";
      renderPills(meta, p.tech);
      card.appendChild(meta);
    }

    if (Array.isArray(p.links) && p.links.length > 0) {
      const links = document.createElement("div");
      links.className = "project-links";
      renderLinks(links, p.links);
      card.appendChild(links);
    }

    grid.appendChild(card);
  }
}

function renderContact(contact) {
  safeText(el("contactLead"), contact?.lead, "");
  safeText(el("contactEmail"), contact?.email, "");
  safeText(el("contactLocation"), contact?.location, "");

  const social = el("socialLinks");
  renderLinks(social, contact?.social);
}

async function init() {
  applyThemeToggle();

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
    const data = await res.json();

    // Minimal "required" validation: enough to render a good page.
    if (!isNonEmptyString(data?.hero?.name) || !isNonEmptyString(data?.hero?.role)) {
      console.warn("Missing required hero fields (name/role) in data/profile.json");
    }
    if (!isNonEmptyString(data?.contact?.email)) {
      console.warn("Missing required contact.email in data/profile.json");
    }

    setDocumentMeta(data.site);
    renderHero(data.hero);
    renderAbout(data.about);
    renderProjects(data.projects);
    renderContact(data.contact);
  } catch (err) {
    console.error(err);
  }
}

init();