const slides = Array.from(document.querySelectorAll(".slide"));
const currentSlideEl = document.getElementById("current-slide");
const totalSlidesEl = document.getElementById("total-slides");
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const fullscreenButton = document.getElementById("toggle-stage");
const dotnav = document.getElementById("dotnav");
const topbar = document.querySelector(".topbar");

let currentIndex = 0;
let stageUiHideTimer;

function renderDots() {
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.ariaLabel = slide.dataset.title || `Слайд ${index + 1}`;
    button.title = slide.dataset.title || `Слайд ${index + 1}`;
    button.addEventListener("click", () => goToSlide(index));
    dotnav.appendChild(button);
  });
}

function syncUi(index) {
  currentIndex = index;
  currentSlideEl.textContent = String(index + 1);
  totalSlidesEl.textContent = String(slides.length);

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });

  Array.from(dotnav.children).forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });

  const nextHash = `#${slides[index].id}`;
  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}

function goToSlide(index) {
  const safeIndex = Math.max(0, Math.min(index, slides.length - 1));
  slides[safeIndex].scrollIntoView({ behavior: "smooth", block: "start" });
}

function showStageUi() {
  document.body.classList.remove("stage-ui-hidden");
  window.clearTimeout(stageUiHideTimer);
  stageUiHideTimer = window.setTimeout(() => {
    document.body.classList.add("stage-ui-hidden");
  }, 1600);
}

function resetStageUi() {
  window.clearTimeout(stageUiHideTimer);
  document.body.classList.remove("stage-ui-hidden");
}

function syncFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement);
  if (!fullscreenButton) {
    return;
  }

  fullscreenButton.textContent = isFullscreen ? "Выйти" : "Во весь экран";
  fullscreenButton.setAttribute(
    "aria-label",
    isFullscreen ? "Выйти из полноэкранного режима" : "Включить полноэкранный режим"
  );
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (_) {
      // Ignore fullscreen request errors; the presentation layout still remains active.
    }
  } else {
    try {
      await document.exitFullscreen();
    } catch (_) {
      // Ignore fullscreen exit errors and keep the UI responsive.
    }
  }
}

function handleKeydown(event) {
  if (event.target instanceof HTMLElement) {
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") {
      return;
    }
  }

  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    goToSlide(currentIndex + 1);
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goToSlide(currentIndex - 1);
  }

  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    goToSlide(slides.length - 1);
  }

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleFullscreen();
  }

  showStageUi();
}

function initialIndexFromHash() {
  const hash = window.location.hash.replace("#", "");
  const foundIndex = slides.findIndex((slide) => slide.id === hash);
  return foundIndex >= 0 ? foundIndex : 0;
}

function setupAiRadar() {
  const card = document.querySelector(".ai-radar-card");
  if (!card) {
    return;
  }

  const axes = [
    { key: "text", label: "текст" },
    { key: "tools", label: "tools" },
    { key: "code", label: "код" },
    { key: "media", label: "медиа" },
    { key: "local", label: "локальный контур" },
    { key: "access", label: "цена / доступ" },
  ];

  const profiles = {
    openai: {
      name: "OpenAI",
      description: "Сильный универсальный контур: текст, reasoning, код, инструменты и мультимодальность.",
      values: { text: 95, tools: 92, code: 90, media: 86, local: 58, access: 64 },
    },
    deepseek: {
      name: "DeepSeek",
      description: "Сильный reasoning и код при хорошем балансе цены и качества, но слабее как массовая продуктовая экосистема.",
      values: { text: 84, tools: 66, code: 88, media: 52, local: 55, access: 90 },
    },
    midjourney: {
      name: "Midjourney",
      description: "Специалист по визуальному качеству: почти не универсальный ассистент, зато очень силен в генерации изображений.",
      values: { text: 34, tools: 28, code: 16, media: 98, local: 38, access: 56 },
    },
    gigachat: {
      name: "GigaChat",
      description: "Практичный российский контур: русский язык, локальная доступность, B2B-сценарии и интеграции.",
      values: { text: 74, tools: 65, code: 56, media: 70, local: 94, access: 80 },
    },
  };

  const center = { x: 230, y: 206 };
  const radius = 144;
  const grid = card.querySelector("#radar-grid");
  const axesLayer = card.querySelector("#radar-axes");
  const shape = card.querySelector("#radar-shape");
  const points = card.querySelector("#radar-points");
  const nameEl = card.querySelector("#radar-name");
  const descriptionEl = card.querySelector("#radar-description");
  const titleEl = card.querySelector("#radar-product");
  const legend = card.querySelector("#radar-axis-legend");
  const buttons = Array.from(card.querySelectorAll("[data-ai-profile]"));

  function pointForAxis(index, value = 100, extraRadius = 0) {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / axes.length;
    const distance = ((radius + extraRadius) * value) / 100;
    return {
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
    };
  }

  function pointsToString(items) {
    return items.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  }

  function renderFrame() {
    if (!grid || !axesLayer || !legend) {
      return;
    }

    grid.innerHTML = "";
    axesLayer.innerHTML = "";
    legend.innerHTML = "";

    [20, 40, 60, 80, 100].forEach((level) => {
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute("points", pointsToString(axes.map((_, index) => pointForAxis(index, level))));
      grid.appendChild(polygon);
    });

    axes.forEach((axis, index) => {
      const end = pointForAxis(index, 100);
      const labelPoint = pointForAxis(index, 100, 30);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(center.x));
      line.setAttribute("y1", String(center.y));
      line.setAttribute("x2", String(end.x));
      line.setAttribute("y2", String(end.y));
      axesLayer.appendChild(line);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(labelPoint.x));
      label.setAttribute("y", String(labelPoint.y));
      label.setAttribute("text-anchor", labelPoint.x < center.x - 8 ? "end" : labelPoint.x > center.x + 8 ? "start" : "middle");
      label.setAttribute("dominant-baseline", "middle");
      label.textContent = axis.label;
      axesLayer.appendChild(label);

      const legendItem = document.createElement("span");
      legendItem.textContent = axis.label;
      legend.appendChild(legendItem);
    });
  }

  function updateProfile(profileKey) {
    const profile = profiles[profileKey] || profiles.openai;
    const profilePoints = axes.map((axis, index) => pointForAxis(index, profile.values[axis.key]));

    if (shape) {
      shape.setAttribute("points", pointsToString(profilePoints));
    }

    if (points) {
      points.innerHTML = "";
      profilePoints.forEach((point) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", String(point.x));
        circle.setAttribute("cy", String(point.y));
        circle.setAttribute("r", "5");
        points.appendChild(circle);
      });
    }

    if (nameEl) {
      nameEl.textContent = profile.name;
    }

    if (descriptionEl) {
      descriptionEl.textContent = profile.description;
    }

    if (titleEl) {
      titleEl.textContent = `Профиль ${profile.name}`;
    }

    buttons.forEach((button) => {
      const isActive = button.dataset.aiProfile === profileKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }

  renderFrame();
  updateProfile("openai");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      updateProfile(button.dataset.aiProfile || "openai");
      showStageUi();
    });
  });
}

renderDots();
setupAiRadar();
syncUi(initialIndexFromHash());
syncFullscreenButton();
showStageUi();

window.addEventListener("keydown", handleKeydown);
window.addEventListener("mousemove", showStageUi);
window.addEventListener("mousedown", showStageUi);

prevButton.addEventListener("click", () => goToSlide(currentIndex - 1));
nextButton.addEventListener("click", () => goToSlide(currentIndex + 1));

if (fullscreenButton) {
  fullscreenButton.addEventListener("click", () => {
    toggleFullscreen();
  });
}

if (topbar) {
  topbar.addEventListener("mouseenter", showStageUi);
  topbar.addEventListener("focusin", showStageUi);
}

document.addEventListener("fullscreenchange", () => {
  syncFullscreenButton();
  if (document.fullscreenElement) {
    showStageUi();
  } else {
    resetStageUi();
    showStageUi();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    const nextIndex = slides.indexOf(visible.target);
    if (nextIndex >= 0) {
      syncUi(nextIndex);
    }
  },
  { threshold: [0.45, 0.6, 0.8] }
);

slides.forEach((slide) => observer.observe(slide));

if (window.location.hash) {
  const startIndex = initialIndexFromHash();
  setTimeout(() => goToSlide(startIndex), 80);
}
