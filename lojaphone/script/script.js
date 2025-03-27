const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector(".menu-button");


navbar.classList.remove("show-menu");

menuButton.addEventListener("click", () => {
    navbar.classList.toggle("show-menu");
});