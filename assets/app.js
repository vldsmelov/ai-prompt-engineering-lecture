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

renderDots();
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
