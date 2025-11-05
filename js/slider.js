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
slidesContainer.addEventListener(
  "touchstart",
  (e) => (startX = e.touches[0].clientX)
);
slidesContainer.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextSlide();
  if (endX - startX > 50) prevSlide();
});

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
