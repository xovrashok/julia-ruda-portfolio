const burger = document.getElementById("burger-btn");
const closeBtn = document.getElementById("close-btn");
const nav = document.getElementById("header__nav");
const links = document.querySelectorAll(".header__link");

burger.addEventListener("click", () => {
  nav.classList.add("active");
  burger.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  nav.classList.remove("active");
  burger.classList.remove("active");
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    burger.classList.remove("active");
  });
});
