const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const auditForm = document.querySelector("[data-audit-form]");

if (auditForm) {
  auditForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = auditForm.dataset.appsScriptUrl;
    const status = auditForm.querySelector("[data-form-status]");
    const submitButton = auditForm.querySelector("button[type='submit']");
    const formData = new FormData(auditForm);

    formData.append("submittedAt", new Date().toISOString());
    formData.append("pageUrl", window.location.href);

    if (!endpoint) {
      if (status) status.textContent = "Form endpoint is not connected yet. Redirecting to the thank you page.";
      window.location.href = "thank-you.html";
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }
    if (status) status.textContent = "Sending your request...";

    try {
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });
      window.location.href = "thank-you.html";
    } catch {
      if (status) status.textContent = "Something went wrong. Please send me a WhatsApp message instead.";
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Book a Free Growth Audit";
      }
    }
  });
}

const canUseFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const siteCursor = document.querySelector(".site-cursor");

if (siteCursor && canUseFinePointer) {
  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;

  const renderCursor = () => {
    siteCursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    cursorFrame = 0;
  };

  document.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    siteCursor.classList.add("is-visible");

    if (!cursorFrame) cursorFrame = requestAnimationFrame(renderCursor);
  }, { passive: true });

  document.addEventListener("mouseleave", () => siteCursor.classList.remove("is-visible"));

  document.querySelectorAll("a, button, input, select, textarea").forEach((element) => {
    element.addEventListener("mouseenter", () => siteCursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => siteCursor.classList.remove("is-active"));
  });
}

const heroSentences = [
  "I BUILD STRATEGIES THAT DRIVE REAL GROWTH.",
  "I HELP BRANDS REACH THE RIGHT AUDIENCE.",
  "I AM ADHIL ASHRAF, A PERFORMANCE MARKETER.",
  "I TURN IDEAS INTO HIGH-PERFORMING CAMPAIGNS."
];

const heroRotatorOptions = {
  sentences: heroSentences,
  pauseDuration: 4000,
  transitionDuration: 850,
  loop: true
};

class HeroSentenceRotator {
  constructor(root, options) {
    this.root = root;
    this.hero = root.closest(".hero") || document;
    this.textElement = root.querySelector("[data-typewriter-text]");
    this.liveRegion = root.querySelector("[data-typewriter-live]");
    this.toggle = this.hero.querySelector("[data-typewriter-toggle]");
    this.toggleText = this.hero.querySelector("[data-typewriter-toggle-text]");
    this.sentences = options.sentences || [];
    this.pauseDuration = options.pauseDuration || 1000;
    this.transitionDuration = options.transitionDuration || 300;
    this.loop = options.loop !== false;
    this.motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.sentenceIndex = 0;
    this.isPaused = false;
    this.timerId = 0;
    this.timerStartedAt = 0;
    this.timerDelay = 0;
    this.timerRemaining = 0;
    this.timerCallback = null;

    this.handleToggle = this.handleToggle.bind(this);
    this.handleMotionChange = this.handleMotionChange.bind(this);
  }

  init() {
    if (!this.root || !this.textElement || !this.sentences.length) return;

    this.root.dataset.sentenceCount = String(this.sentences.length);
    this.root.dataset.currentSentence = "0";

    if (this.toggle) this.toggle.addEventListener("click", this.handleToggle);

    this.root.classList.toggle("is-reduced-motion", this.motionQuery.matches);
    this.motionQuery.addEventListener("change", this.handleMotionChange);
    this.showSentence();
  }

  handleMotionChange(event) {
    this.root.classList.toggle("is-reduced-motion", event.matches);
  }

  handleToggle() {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  pause() {
    if (this.isPaused) return;

    this.isPaused = true;
    this.root.classList.add("is-paused");
    this.timerRemaining = Math.max(0, this.timerDelay - (performance.now() - this.timerStartedAt));
    this.clearTimer(false);
    this.updateToggle();
  }

  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.root.classList.remove("is-paused");
    this.updateToggle();

    if (this.timerCallback) {
      this.setTimer(this.timerCallback, this.timerRemaining || this.pauseDuration);
    } else {
      this.showSentence();
    }
  }

  updateToggle() {
    if (!this.toggle) return;

    const visibleText = this.isPaused ? "Resume animation" : "Pause animation";
    this.toggle.setAttribute(
      "aria-label",
      this.isPaused ? "Resume headline animation" : "Pause headline animation"
    );
    if (this.toggleText) this.toggleText.textContent = visibleText;
  }

  setTimer(callback, delay) {
    this.clearTimer(false);
    this.timerCallback = callback;
    this.timerDelay = delay;
    this.timerStartedAt = performance.now();
    this.timerId = window.setTimeout(callback, delay);
  }

  clearTimer(resetCallback = true) {
    if (this.timerId) window.clearTimeout(this.timerId);
    this.timerId = 0;
    if (resetCallback) this.timerCallback = null;
  }

  showSentence() {
    if (this.isPaused) return;

    const sentence = this.sentences[this.sentenceIndex];
    this.root.dataset.currentSentence = String(this.sentenceIndex);
    this.root.classList.add("is-transitioning");
    this.root.classList.remove("is-sentence-visible");
    this.textElement.textContent = sentence;
    if (this.liveRegion) this.liveRegion.textContent = sentence;

    window.requestAnimationFrame(() => {
      if (this.isPaused) return;
      this.root.classList.remove("is-transitioning");
      this.root.classList.add("is-sentence-visible");
    });

    this.setTimer(() => this.startTransition(), this.pauseDuration);
  }

  startTransition() {
    if (this.isPaused) return;

    this.root.classList.add("is-transitioning");
    this.root.classList.remove("is-sentence-visible");
    this.setTimer(() => this.nextSentence(), this.transitionDuration);
  }

  nextSentence() {
    if (this.isPaused) return;

    this.root.classList.remove("is-transitioning", "is-sentence-visible");
    this.sentenceIndex += 1;

    if (this.sentenceIndex >= this.sentences.length) {
      if (!this.loop) return;
      this.sentenceIndex = 0;
    }

    this.setTimer(() => this.showSentence(), 40);
  }

  destroy() {
    this.clearTimer();
    if (this.toggle) this.toggle.removeEventListener("click", this.handleToggle);
    this.motionQuery.removeEventListener("change", this.handleMotionChange);
  }
}

const setupTypewriterHero = () => {
  const root = document.querySelector("[data-typewriter-hero]");
  if (!root) return null;

  const rotator = new HeroSentenceRotator(root, heroRotatorOptions);
  rotator.init();
  window.addEventListener("pagehide", () => rotator.destroy(), { once: true });
  return rotator;
};

const revealSelector = [
  ".typewriter-hero",
  ".proof-grid > *",
  ".section-heading",
  ".split-section > *",
  ".process-grid > *",
  ".card-grid > *",
  ".case-grid > *",
  ".package-grid > *",
  ".faq-grid > *",
  ".story-panel",
  ".form-panel",
  ".lead-magnet > *",
  ".final-cta > *",
  ".page-hero > *",
  ".content-narrow > *",
  ".site-footer > *"
].join(",");

const setupReveals = () => {
  const revealItems = [...document.querySelectorAll(revealSelector)];

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);

    if (item.classList.contains("typewriter-hero")) item.dataset.reveal = "fade-up";
    if (item.matches(".card, .case-card, .package, .faq-item, .story-panel, .form-panel, .process-grid > *")) {
      item.dataset.reveal = "zoom";
    }
  });

  document.body.classList.add("animations-ready");

  const revealInView = () => {
    const triggerLine = window.innerHeight * 0.9;

    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) return;

      if (item.getBoundingClientRect().top < triggerLine) {
        item.classList.add("is-visible");
      }
    });
  };

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.08
  });

  revealItems.forEach((item) => observer.observe(item));

  let revealFrame = 0;
  const scheduleReveal = () => {
    if (revealFrame) return;

    revealFrame = requestAnimationFrame(() => {
      revealInView();
      revealFrame = 0;
    });
  };

  requestAnimationFrame(revealInView);
  window.addEventListener("load", revealInView, { once: true });
  window.addEventListener("pageshow", revealInView, { once: true });
  window.addEventListener("scroll", scheduleReveal, { passive: true });
  window.addEventListener("resize", scheduleReveal);
};

const setupCounters = () => {
  const counters = [...document.querySelectorAll(".proof-grid strong")];
  if (!counters.length) return;

  const animateCounter = (counter) => {
    if (counter.dataset.countAnimated === "true") return;

    const originalText = counter.textContent;
    const match = originalText.replace(/,/g, "").match(/[\d.]+/);
    if (!match) return;

    counter.dataset.countAnimated = "true";
    const target = Number(match[0]);
    const prefix = originalText.slice(0, match.index);
    const suffix = originalText.slice(match.index + match[0].length);
    const start = performance.now();
    const duration = 950;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased).toLocaleString("en-US");

      counter.textContent = `${prefix}${current}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = originalText;
      }
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCounter);
    return;
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.25
  });

  counters.forEach((counter) => counterObserver.observe(counter));
};

setupTypewriterHero();
setupReveals();
setupCounters();
