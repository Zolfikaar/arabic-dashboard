const themeToggler = document.querySelector(".theme-toggler"),
  body = document.querySelector("body"),
  icon = themeToggler.querySelector("span i");

// toggle theme
themeToggler.addEventListener("click", () => {
  body.classList.toggle("dark-theme");

  // if the body has the dark-theme class, save it to local storage
  if (body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark-theme");
    icon.classList.add("bx-sun");
    icon.classList.remove("bx-moon");
  } else {
    // if the body doesn't have the dark-theme class, remove the value if it exist in local storage
    localStorage.removeItem("theme", "light-theme");
    icon.classList.remove("bx-sun");
    icon.classList.add("bx-moon");
  }
});

// check if there is a theme saved in local storage, then apply it
document.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("theme", "dark-theme")) {
    body.classList.add("dark-theme");
    icon.classList.add("bx-sun");
    icon.classList.remove("bx-moon");
  } else {
    icon.classList.remove("bx-sun");
    icon.classList.add("bx-moon");
  }
});
