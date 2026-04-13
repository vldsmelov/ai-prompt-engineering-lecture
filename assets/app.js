const slides = Array.from(document.querySelectorAll(".slide"));
const currentSlideEl = document.getElementById("current-slide");
const totalSlidesEl = document.getElementById("total-slides");
const prevButton = document.getElementById("prev-slide");
const nextButton = document.getElementById("next-slide");
const toggleStageButton = document.getElementById("toggle-stage");
const dotnav = document.getElementById("dotnav");

let currentIndex = 0;
let stageMode = false;

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
    toggleStageMode();
  }
}

function initialIndexFromHash() {
  const hash = window.location.hash.replace("#", "");
  const foundIndex = slides.findIndex((slide) => slide.id === hash);
  return foundIndex >= 0 ? foundIndex : 0;
}

function syncStageUi() {
  document.body.classList.toggle("stage-mode", stageMode);
  if (toggleStageButton) {
    toggleStageButton.textContent = stageMode ? "Окно" : "Экран";
    toggleStageButton.setAttribute(
      "aria-label",
      stageMode ? "Выключить широкий режим" : "Включить широкий режим"
    );
  }
}

async function toggleStageMode() {
  stageMode = !stageMode;
  syncStageUi();
  if (!document.fullscreenElement && stageMode) {
    try {
      await document.documentElement.requestFullscreen();
    } catch (_) {
      // Wide layout still works even if fullscreen is denied by the browser.
    }
  } else if (document.fullscreenElement && !stageMode) {
    try {
      await document.exitFullscreen();
    } catch (_) {
      // Ignore fullscreen exit errors and keep the wide layout state in sync.
    }
  }
}

renderDots();
syncUi(initialIndexFromHash());
syncStageUi();

window.addEventListener("keydown", handleKeydown);
prevButton.addEventListener("click", () => goToSlide(currentIndex - 1));
nextButton.addEventListener("click", () => goToSlide(currentIndex + 1));
if (toggleStageButton) {
  toggleStageButton.addEventListener("click", () => {
    toggleStageMode();
  });
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && stageMode) {
    stageMode = false;
    syncStageUi();
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
