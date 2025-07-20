let listItems = document.querySelectorAll(".nav-item");

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".sidebar");
let main = document.querySelector(".main");
let close = document.querySelector('.toggle i[name="close"]');
let menu = document.querySelector('.toggle i[name="menu"]');

//  Sidebar Toggler
// Menu Toggle
toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");

  if (navigation.classList.contains("active")) {
    menu.style.display = "none";
    close.style.display = "block";
  } else {
    menu.style.display = "block";
    close.style.display = "none";
  }
};

// User drop down menu toggle
const resultBox = document.querySelector(".result-box"),
  selectBtn = document.querySelector(".select-btn");

selectBtn.addEventListener("click", () => {
  resultBox.classList.toggle("active");
  selectBtn.classList.toggle("active");
});

// Nested navigation toggle
function toggleSubmenu(element) {
  const navItem = element.parentNode;
  const submenu = navItem.querySelector(".sub-menu");

  navItem.classList.toggle("open");

  if (navItem.classList.contains("open")) {
    submenu.style.display = "block";
  } else {
    submenu.style.display = "none";
  }
}

// Language switching functionality
let currentLanguage = "ar";

function toggleLanguage() {
  const html = document.documentElement;
  const languageBtn = document.getElementById("languageBtn");

  if (currentLanguage === "ar") {
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    languageBtn.textContent = "English";
    currentLanguage = "en";

    // Update page text for English
    updateTextContent("en");
  } else {
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
    languageBtn.textContent = "العربية";
    currentLanguage = "ar";

    // Update page text for Arabic
    updateTextContent("ar");
  }

  localStorage.setItem("language", currentLanguage);
}

// Text content for different languages
const translations = {
  ar: {
    search: "بحث",
    dashboard: "لوحة التحكم",
    products: "المنتجات",
    orders: "الطلبيات",
    categories: "الاقسام",
    packages: "البكجات",
    offers: "العروض",
    customers: "الزبائن",
    admins: "المسؤولين",
    warehouse: "المخزن",
    returns: "المرجوع",
    damaged: "التلف",
    reports: "التقارير",
    components: "العناصر",
    forms: "النماذج",
    settings: "الاعدادات",
    profits: "الارباح",
  },
  en: {
    search: "Search",
    dashboard: "Dashboard",
    products: "Products",
    orders: "Orders",
    categories: "Categories",
    packages: "Packages",
    offers: "Offers",
    customers: "Customers",
    admins: "Admins",
    warehouse: "Warehouse",
    returns: "Returns",
    damaged: "Damaged",
    reports: "Reports",
    components: "Components",
    forms: "Forms",
    settings: "Settings",
    profits: "Profits",
  },
};

function updateTextContent(lang) {
  // Update search placeholder for both regular search and global search
  const searchInput = document.querySelector(".search input");
  if (searchInput) {
    searchInput.placeholder = translations[lang].search;
  }

  const globalSearchInput = document.querySelector(".search-input");
  if (globalSearchInput) {
    globalSearchInput.placeholder = translations[lang].search;
  }

  // Update navigation titles
  const navTitles = document.querySelectorAll(".nav-list .title");
  const keys = Object.keys(translations[lang]);

  navTitles.forEach((title, index) => {
    if (
      keys[index] &&
      title.textContent.trim() !== "العلامة" &&
      title.textContent.trim() !== "Brand"
    ) {
      if (index === 0) return; // Skip brand name
      const key = keys[index];
      if (translations[lang][key]) {
        title.textContent = translations[lang][key];
      }
    }
  });

  // Update card names
  const cardNames = document.querySelectorAll(".cardName");
  const cardKeys = ["products", "categories", "orders", "profits"];
  cardNames.forEach((card, index) => {
    if (cardKeys[index] && translations[lang][cardKeys[index]]) {
      card.textContent = translations[lang][cardKeys[index]];
    }
  });
}

// Color changing functionality
function toggleColorPalette() {
  const palette = document.getElementById("colorPalette");
  palette.classList.toggle("active");
}

function changeColor(color) {
  document.documentElement.style.setProperty("--color-primary", color);

  // Update active color option
  document.querySelectorAll(".color-option").forEach((option) => {
    option.classList.remove("active");
  });

  document.querySelector(`[data-color="${color}"]`).classList.add("active");

  // Save color preference
  localStorage.setItem("primaryColor", color);

  // Close palette
  document.getElementById("colorPalette").classList.remove("active");
}

// Initialize saved preferences
document.addEventListener("DOMContentLoaded", () => {
  // Load saved language
  const savedLanguage = localStorage.getItem("language");
  if (savedLanguage && savedLanguage !== currentLanguage) {
    toggleLanguage();
  }

  // Load saved color
  const savedColor = localStorage.getItem("primaryColor");
  if (savedColor) {
    changeColor(savedColor);
  }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  // Close color palette
  if (!e.target.closest(".color-picker")) {
    document.getElementById("colorPalette").classList.remove("active");
  }

  // Close user dropdown
  if (!e.target.closest(".dropBox")) {
    document.querySelector(".result-box").classList.remove("active");
    document.querySelector(".select-btn").classList.remove("active");
  }
});
