const slidesContainer = document.querySelector(".slider__slides");
const slides = document.querySelectorAll(".slider__slide");
const prevBtn = document.querySelector(".arrow__button.prev");
const nextBtn = document.querySelector(".arrow__button.next");
const dotsContainer = document.querySelector(".slider__dots");
const totalSlides = slides.length;

let currentIndex = 1;
let autoSlideInterval;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

slidesContainer.appendChild(firstClone);
slidesContainer.insertBefore(lastClone, slidesContainer.firstChild);

const allSlides = document.querySelectorAll(".slider__slide");
const slideWidth = 100;

slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(i + 1));
  dotsContainer.appendChild(dot);
}
const dots = document.querySelectorAll(".dot");

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex - 1);
  });
}

function showSlide(index, transition = true) {
  slidesContainer.style.transition = transition
    ? "transform 0.5s ease-in-out"
    : "none";
  slidesContainer.style.transform = `translateX(-${index * slideWidth}%)`;
}

function goToSlide(index) {
  currentIndex = index;
  showSlide(currentIndex);
  updateDots();
  restartAutoSlide();
}

function nextSlide() {
  if (currentIndex >= allSlides.length - 1) return;
  currentIndex++;
  showSlide(currentIndex);
  restartAutoSlide();
}

function prevSlide() {
  if (currentIndex <= 0) return;
  currentIndex--;
  showSlide(currentIndex);
  restartAutoSlide();
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

slidesContainer.addEventListener("transitionend", () => {
  if (allSlides[currentIndex].id === "first-clone") {
    currentIndex = 1;
    showSlide(currentIndex, false);
  }
  if (allSlides[currentIndex].id === "last-clone") {
    currentIndex = totalSlides;
    showSlide(currentIndex, false);
  }
  updateDots();
});

let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let dragging = false;
let velocity = 0;
let lastTouchX = 0;
let lastMoveTime = 0;

slidesContainer.addEventListener("touchstart", touchStart);
slidesContainer.addEventListener("touchmove", touchMove);
slidesContainer.addEventListener("touchend", touchEnd);

function touchStart(e) {
  startX = e.touches[0].clientX;
  lastTouchX = startX;
  lastMoveTime = Date.now();
  dragging = true;
  velocity = 0;
  stopAutoSlide();
  cancelAnimationFrame(animationID);
}

function touchMove(e) {
  if (Math.abs(diff) > window.innerWidth / 2) return;
  if (!dragging) return;
  const currentX = e.touches[0].clientX;
  const diff = currentX - startX;

  const now = Date.now();
  const deltaTime = now - lastMoveTime;
  const deltaX = currentX - lastTouchX;

  velocity = deltaX / deltaTime;
  lastTouchX = currentX;
  lastMoveTime = now;

  currentTranslate =
    -currentIndex * slideWidth + (diff / window.innerWidth) * 100;
  slidesContainer.style.transition = "none";
  slidesContainer.style.transform = `translateX(${currentTranslate}%)`;
}

function touchEnd() {
  dragging = false;
  slidesContainer.style.transition = "transform 0.5s ease-in-out";

  const movedBy = currentTranslate + currentIndex * slideWidth;

  if (movedBy < -10 || velocity < -0.5) {
    nextSlide();
  } else if (movedBy > 10 || velocity > 0.5) {
    prevSlide();
  } else {
    showSlide(currentIndex);
  }

  startAutoSlide();
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function restartAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

const sliderWrapper = document.querySelector(".slider__wrapper");
sliderWrapper.addEventListener("mouseenter", stopAutoSlide);
sliderWrapper.addEventListener("mouseleave", startAutoSlide);

startAutoSlide();
