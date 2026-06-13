const CONTENT_STORAGE_KEY = "adhilSiteContent";

const defaultSiteContent = {
  hero: {
    sentences: [
      "I BUILD STRATEGIES THAT DRIVE REAL GROWTH.",
      "I HELP BRANDS REACH THE RIGHT AUDIENCE.",
      "I AM ADHIL ASHRAF, A PERFORMANCE MARKETER.",
      "I TURN IDEAS INTO HIGH-PERFORMING CAMPAIGNS."
    ],
    description: "Performance marketing, Meta Ads, landing pages, and WhatsApp funnels for UAE brands that want qualified leads.",
    primaryCta: "Contact Now",
    secondaryCta: "All Services"
  },
  proof: {
    note: "Dummy MVP numbers. Replace with verified proof before launch.",
    metrics: [
      { value: "8,000+", label: "sample prospects handled" },
      { value: "AED 400K+", label: "sample revenue influenced" },
      { value: "6+", label: "sample industries mapped" },
      { value: "12+", label: "sample funnel tests planned" }
    ]
  },
  problem: {
    eyebrow: "The real issue",
    title: "Most Businesses Don’t Have a Traffic Problem. They Have a Conversion Problem.",
    points: [
      "Ads are running, but leads are poor quality.",
      "Leads come in, but the sales team does not convert them.",
      "Tracking is unclear, follow-up is slow, and budgets are spent without learning.",
      "The offer, landing page, and WhatsApp flow are not working together."
    ]
  },
  approach: {
    eyebrow: "My approach",
    title: "I Build Campaigns Around Revenue, Not Just Clicks.",
    steps: [
      { number: "01", title: "Offer clarity", text: "Shape the promise, audience, proof, and CTA before scaling spend." },
      { number: "02", title: "Audience research", text: "Map local UAE buying behavior and qualification signals." },
      { number: "03", title: "Creative testing", text: "Test hooks, proof angles, and intent levels with a clear learning plan." },
      { number: "04", title: "Funnel setup", text: "Connect landing pages, lead forms, WhatsApp, and sales handover." },
      { number: "05", title: "Tracking", text: "Define the events and reporting that show what actually moved." },
      { number: "06", title: "Optimization", text: "Review weekly, improve quality, and decide the next action from data." }
    ]
  },
  servicesPreview: {
    eyebrow: "Services",
    title: "Focused Support for Paid Ads and Lead Conversion",
    items: [
      { title: "Meta Ads Management", text: "Campaign structure, audience strategy, budget planning, creative tests, optimization, and reporting." },
      { title: "Lead Generation Campaigns", text: "Lead forms, landing page direction, qualification questions, and quality improvement." },
      { title: "Landing Page Strategy", text: "Page structure, offer copy, CTA sequence, form strategy, and trust-section planning." },
      { title: "WhatsApp Funnel Setup", text: "Auto-replies, follow-up messages, objection handling, qualification flow, and booking scripts." },
      { title: "Campaign Audit", text: "Review ads, creatives, targeting, tracking, landing page experience, and follow-up process." },
      { title: "Sales Follow-Up Optimization", text: "Improve response templates, handover flow, lead stages, and daily sales actions." }
    ]
  },
  casesPreview: {
    eyebrow: "Sample case studies",
    title: "Dummy Examples to Show the Final Case Study Format",
    items: [
      { tag: "Education Campaign", title: "Improved demo booking intent", challenge: "Low-quality leads and poor follow-up.", strategy: "Offer refinement, WhatsApp qualification, demo booking flow.", metric: "Sample result: 34% more qualified conversations" },
      { tag: "Training Institute", title: "Reduced wasted sales effort", challenge: "Many inquiries, unclear readiness.", strategy: "Added qualification questions and response templates.", metric: "Sample result: 22% better response rate" },
      { tag: "Local Service", title: "Sharper lead capture journey", challenge: "Traffic sent to weak service page.", strategy: "Mobile-first landing page and trust-led CTA flow.", metric: "Sample result: 2.8x landing page conversion" }
    ]
  },
  why: {
    eyebrow: "Why work with me",
    title: "Performance Marketing With Sales Reality Built In",
    points: [
      "Performance marketing plus lead-handling and sales follow-up experience.",
      "Understands UAE lead behavior and WhatsApp-based conversion.",
      "Strong fit for education, service, clinics, training, real estate, and startup funnels.",
      "Simple reporting focused on revenue signals, not vanity metrics."
    ]
  },
  leadMagnet: {
    eyebrow: "Free resource",
    title: "Get the UAE Lead Generation Funnel Checklist",
    text: "Use this as placeholder lead magnet content until the final PDF is ready.",
    cta: "Request Checklist"
  },
  finalCta: {
    title: "Want to Know Why Your Ads Are Not Converting?",
    text: "Send your campaign, landing page, or current funnel for a practical review.",
    cta: "Book a Free 20-Minute Campaign Audit"
  },
  global: {
    brandName: "Adhil Bin Asharf",
    footerText: "Performance marketing for Abu Dhabi and Dubai businesses that need qualified leads, WhatsApp conversations, bookings, and sales.",
    whatsapp: "+971 56 644 8099",
    location: "Abu Dhabi, United Arab Emirates",
    serviceArea: "Abu Dhabi, Dubai, and UAE businesses"
  }
};

const cloneContent = (content) => JSON.parse(JSON.stringify(content));

const mergeContent = (base, override) => {
  if (!override || typeof override !== "object") return cloneContent(base);
  const output = Array.isArray(base) ? [...base] : { ...base };

  Object.keys(override).forEach((key) => {
    if (Array.isArray(override[key])) {
      output[key] = override[key];
      return;
    }

    if (override[key] && typeof override[key] === "object" && base[key]) {
      output[key] = mergeContent(base[key], override[key]);
      return;
    }

    output[key] = override[key];
  });

  return output;
};

const getSiteContent = () => {
  try {
    const stored = localStorage.getItem(CONTENT_STORAGE_KEY);
    return stored ? mergeContent(defaultSiteContent, JSON.parse(stored)) : cloneContent(defaultSiteContent);
  } catch {
    return cloneContent(defaultSiteContent);
  }
};

const saveSiteContent = (content) => {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content, null, 2));
};

const setText = (selector, value, root = document) => {
  const element = root.querySelector(selector);
  if (element && value !== undefined) element.textContent = value;
};

const renderList = (selector, items, template) => {
  const element = document.querySelector(selector);
  if (!element || !Array.isArray(items)) return;
  element.innerHTML = items.map(template).join("");
};

const applySiteContent = () => {
  const content = getSiteContent();

  document.querySelectorAll(".brand span").forEach((element) => {
    element.textContent = content.global.brandName;
  });

  setText(".footer-brand p", content.global.footerText);
  setText(".footer-contact a", `WhatsApp: ${content.global.whatsapp}`);
  const footerDetails = document.querySelectorAll(".footer-contact span");
  if (footerDetails[0]) footerDetails[0].textContent = `Location: ${content.global.location}`;
  if (footerDetails[1]) footerDetails[1].textContent = `Serving: ${content.global.serviceArea}`;

  if (!document.querySelector(".hero")) return content;

  window.heroSentencesFromContent = content.hero.sentences;
  setText("[data-typewriter-text]", content.hero.sentences[0]);
  setText("[data-typewriter-live]", content.hero.sentences[0]);
  setText(".hero-bottom p", content.hero.description);
  setText(".hero-cta-row .button.primary", content.hero.primaryCta);
  setText(".hero-cta-row .button.secondary", content.hero.secondaryCta);

  setText(".sample-note", content.proof.note);
  renderList(".proof-grid", content.proof.metrics, (item) => `<div><strong>${item.value}</strong><span>${item.label}</span></div>`);

  const splitSections = document.querySelectorAll(".split-section");
  if (splitSections[0]) {
    setText(".eyebrow", content.problem.eyebrow, splitSections[0]);
    setText("h2", content.problem.title, splitSections[0]);
    renderList(".check-list", content.problem.points, (item) => `<p>${item}</p>`);
  }

  const sections = document.querySelectorAll(".section");
  if (sections[0]) {
    setText(".section-heading .eyebrow", content.approach.eyebrow, sections[0]);
    setText(".section-heading h2", content.approach.title, sections[0]);
    renderList(".process-grid", content.approach.steps, (item) => `<article><span>${item.number}</span><h3>${item.title}</h3><p>${item.text}</p></article>`);
  }

  if (sections[1]) {
    setText(".section-heading .eyebrow", content.servicesPreview.eyebrow, sections[1]);
    setText(".section-heading h2", content.servicesPreview.title, sections[1]);
    renderList(".card-grid", content.servicesPreview.items, (item) => `<article class="card"><h3>${item.title}</h3><p>${item.text}</p></article>`);
  }

  if (sections[2]) {
    setText(".section-heading .eyebrow", content.casesPreview.eyebrow, sections[2]);
    setText(".section-heading h2", content.casesPreview.title, sections[2]);
    renderList(".case-grid", content.casesPreview.items, (item) => `<article class="case-card"><p class="tag">${item.tag}</p><h3>${item.title}</h3><p><strong>Challenge:</strong> ${item.challenge}</p><p><strong>Strategy:</strong> ${item.strategy}</p><p class="metric">${item.metric}</p></article>`);
  }

  if (splitSections[1]) {
    setText(".eyebrow", content.why.eyebrow, splitSections[1]);
    setText("h2", content.why.title, splitSections[1]);
    renderList(".feature-list", content.why.points, (item) => `<p>${item}</p>`);
  }

  const leadMagnet = document.querySelector(".lead-magnet");
  if (leadMagnet) {
    setText(".eyebrow", content.leadMagnet.eyebrow, leadMagnet);
    setText("h2", content.leadMagnet.title, leadMagnet);
    setText("p:not(.eyebrow)", content.leadMagnet.text, leadMagnet);
    setText(".button", content.leadMagnet.cta, leadMagnet);
  }

  const finalCta = document.querySelector(".final-cta");
  if (finalCta) {
    setText("h2", content.finalCta.title, finalCta);
    setText("p", content.finalCta.text, finalCta);
    setText(".button", content.finalCta.cta, finalCta);
  }

  return content;
};

window.defaultSiteContent = defaultSiteContent;
window.getSiteContent = getSiteContent;
window.saveSiteContent = saveSiteContent;
window.applySiteContent = applySiteContent;
