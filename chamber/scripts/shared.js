// Shared across all chamber pages: nav toggle, copyright year, last modified.
const menuButton = document.querySelector("#menu-button");
const nav = document.querySelector("#primary-nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;