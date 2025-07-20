// Advanced Components JavaScript
// Tabs, Tables, Pagination, Toast Notifications, Global Search

// ============================================================================
// TABS FUNCTIONALITY
// ============================================================================

class TabManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.tabs = this.container.querySelectorAll(".tab-button");
    this.contents = this.container.querySelectorAll(".tab-content");

    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => this.switchTab(index));
    });
  }

  switchTab(index) {
    // Remove active class from all tabs and contents
    this.tabs.forEach((tab) => tab.classList.remove("active"));
    this.contents.forEach((content) => content.classList.remove("active"));

    // Add active class to selected tab and content
    this.tabs[index].classList.add("active");
    this.contents[index].classList.add("active");
  }
}

// ============================================================================
// TABLE FUNCTIONALITY WITH SORTING
// ============================================================================

class ModernTable {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    if (this.table) {
      this.init();
    }
  }

  init() {
    this.addSortingToHeaders();
    this.addHoverEffects();
  }

  addSortingToHeaders() {
    const headers = this.table.querySelectorAll("thead th");
    headers.forEach((header, index) => {
      if (header.dataset.sortable !== "false") {
        header.classList.add("sortable");
        header.addEventListener("click", () => this.sortTable(index, header));
      }
    });
  }

  sortTable(columnIndex, header) {
    const tbody = this.table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const isAscending = !header.classList.contains("sort-asc");

    // Remove sorting classes from all headers
    this.table.querySelectorAll("thead th").forEach((h) => {
      h.classList.remove("sort-asc", "sort-desc");
    });

    // Add appropriate sorting class
    header.classList.add(isAscending ? "sort-asc" : "sort-desc");

    // Sort rows
    rows.sort((a, b) => {
      const aText = a.cells[columnIndex].textContent.trim();
      const bText = b.cells[columnIndex].textContent.trim();

      // Try to parse as numbers
      const aNum = parseFloat(aText);
      const bNum = parseFloat(bText);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return isAscending ? aNum - bNum : bNum - aNum;
      }

      // Sort as text
      return isAscending
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });

    // Reappend sorted rows
    rows.forEach((row) => tbody.appendChild(row));
  }

  addHoverEffects() {
    const rows = this.table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        row.style.transform = "scale(1.01)";
      });

      row.addEventListener("mouseleave", () => {
        row.style.transform = "scale(1)";
      });
    });
  }
}

// ============================================================================
// DROPDOWN FUNCTIONALITY
// ============================================================================

class Dropdown {
  constructor(dropdownId) {
    this.dropdown = document.getElementById(dropdownId);
    if (this.dropdown) {
      this.init();
    }
  }

  init() {
    this.toggle = this.dropdown.querySelector(".dropdown-toggle");
    this.menu = this.dropdown.querySelector(".dropdown-menu");
    this.items = this.dropdown.querySelectorAll(".dropdown-item");

    this.toggle.addEventListener("click", () => this.toggleMenu());

    this.items.forEach((item) => {
      item.addEventListener("click", (e) => this.selectItem(e.target));
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    const isActive = this.menu.classList.contains("active");
    if (isActive) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.toggle.classList.add("active");
    this.menu.classList.add("active");
  }

  closeMenu() {
    this.toggle.classList.remove("active");
    this.menu.classList.remove("active");
  }

  selectItem(item) {
    // Remove selected class from all items
    this.items.forEach((i) => i.classList.remove("selected"));

    // Add selected class to clicked item
    item.classList.add("selected");

    // Update toggle text
    const toggleText = this.toggle.querySelector(".dropdown-text");
    if (toggleText) {
      toggleText.textContent = item.textContent;
    }

    this.closeMenu();
  }
}

// ============================================================================
// PAGINATION FUNCTIONALITY
// ============================================================================

class Pagination {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      itemsPerPage: options.itemsPerPage || 10,
      maxVisiblePages: options.maxVisiblePages || 5,
      showInfo: options.showInfo !== false,
      showItemsPerPage: options.showItemsPerPage !== false,
      ...options,
    };

    this.currentPage = 1;
    this.totalItems = 0;
    this.data = [];

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
  }

  setData(data) {
    this.data = data;
    this.totalItems = data.length;
    this.currentPage = 1;
    this.render();
    this.updateDisplay();
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.options.itemsPerPage);
  }

  get startIndex() {
    return (this.currentPage - 1) * this.options.itemsPerPage;
  }

  get endIndex() {
    return Math.min(
      this.startIndex + this.options.itemsPerPage,
      this.totalItems
    );
  }

  getCurrentPageData() {
    return this.data.slice(this.startIndex, this.endIndex);
  }

  render() {
    this.container.innerHTML = `
      <div class="pagination-container">
        ${this.options.showInfo ? this.renderInfo() : ""}
        ${this.renderPagination()}
        ${this.options.showItemsPerPage ? this.renderItemsPerPage() : ""}
      </div>
    `;

    this.attachEventListeners();
  }

  renderInfo() {
    return `
      <div class="pagination-info">
        <span id="pagination-info-text">
          Showing ${this.startIndex + 1} to ${this.endIndex} of ${
      this.totalItems
    } entries
        </span>
      </div>
    `;
  }

  renderPagination() {
    const pages = this.getVisiblePages();

    return `
      <ul class="pagination">
        <li class="${this.currentPage === 1 ? "disabled" : ""}">
          <a href="#" class="page-link" data-page="prev">
            <i class='bx bx-chevron-right'></i>
          </a>
        </li>
        
        ${pages
          .map(
            (page) => `
          <li class="${page === this.currentPage ? "active" : ""}">
            <a href="#" class="page-link" data-page="${page}">${page}</a>
          </li>
        `
          )
          .join("")}
        
        <li class="${this.currentPage === this.totalPages ? "disabled" : ""}">
          <a href="#" class="page-link" data-page="next">
            <i class='bx bx-chevron-left'></i>
          </a>
        </li>
      </ul>
    `;
  }

  renderItemsPerPage() {
    return `
      <div class="items-per-page">
        <label>Show:</label>
        <select id="items-per-page-select">
          <option value="5" ${
            this.options.itemsPerPage === 5 ? "selected" : ""
          }>5</option>
          <option value="10" ${
            this.options.itemsPerPage === 10 ? "selected" : ""
          }>10</option>
          <option value="25" ${
            this.options.itemsPerPage === 25 ? "selected" : ""
          }>25</option>
          <option value="50" ${
            this.options.itemsPerPage === 50 ? "selected" : ""
          }>50</option>
        </select>
      </div>
    `;
  }

  getVisiblePages() {
    const maxVisible = this.options.maxVisiblePages;
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  attachEventListeners() {
    const pageLinks = this.container.querySelectorAll(".page-link");
    pageLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.target.closest(".page-link").dataset.page;
        this.goToPage(page);
      });
    });

    if (this.options.showItemsPerPage) {
      const select = this.container.querySelector("#items-per-page-select");
      select.addEventListener("change", (e) => {
        this.options.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.render();
        this.updateDisplay();
      });
    }
  }

  goToPage(page) {
    if (page === "prev" && this.currentPage > 1) {
      this.currentPage--;
    } else if (page === "next" && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (!isNaN(page)) {
      this.currentPage = parseInt(page);
    }

    this.render();
    this.updateDisplay();
  }

  updateDisplay() {
    if (this.options.onPageChange) {
      this.options.onPageChange(this.getCurrentPageData(), this.currentPage);
    }
  }
}

// ============================================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================================

class ToastManager {
  constructor() {
    this.container = this.createContainer();
    this.toasts = [];
  }

  createContainer() {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  show(message, type = "info", options = {}) {
    const toast = this.createToast(message, type, options);
    this.toasts.push(toast);
    this.container.appendChild(toast.element);

    // Trigger animation
    setTimeout(() => {
      toast.element.classList.add("show");
    }, 100);

    // Auto dismiss
    if (options.autoDismiss !== false) {
      const duration = options.duration || 5000;
      toast.progressBar.style.transitionDuration = `${duration}ms`;
      toast.progressBar.style.width = "0%";

      setTimeout(() => {
        this.dismiss(toast);
      }, duration);
    }

    return toast;
  }

  createToast(message, type, options) {
    const id = "toast-" + Date.now() + Math.random().toString(36).substr(2, 9);
    const time = new Date().toLocaleTimeString();

    const icons = {
      success: "bx-check-circle",
      error: "bx-error-circle",
      warning: "bx-error",
      info: "bx-info-circle",
    };

    const titles = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
    };

    const element = document.createElement("div");
    element.className = `toast ${type}`;
    element.id = id;

    element.innerHTML = `
      <div class="toast-header">
        <i class='bx ${icons[type]} toast-icon'></i>
        <div class="toast-title">${options.title || titles[type]}</div>
        <div class="toast-time">${time}</div>
        <button class="toast-close" onclick="toastManager.dismiss('${id}')">
          <i class='bx bx-x'></i>
        </button>
      </div>
      <div class="toast-body">${message}</div>
      <div class="toast-progress">
        <div class="toast-progress-bar"></div>
      </div>
    `;

    const progressBar = element.querySelector(".toast-progress-bar");

    return {
      id,
      element,
      progressBar,
      type,
    };
  }

  dismiss(toastId) {
    const toast =
      typeof toastId === "string"
        ? this.toasts.find((t) => t.id === toastId)
        : toastId;

    if (toast && toast.element) {
      toast.element.classList.add("hide");

      setTimeout(() => {
        if (toast.element.parentNode) {
          toast.element.parentNode.removeChild(toast.element);
        }
        this.toasts = this.toasts.filter((t) => t.id !== toast.id);
      }, 400);
    }
  }

  success(message, options = {}) {
    return this.show(message, "success", options);
  }

  error(message, options = {}) {
    return this.show(message, "error", options);
  }

  warning(message, options = {}) {
    return this.show(message, "warning", options);
  }

  info(message, options = {}) {
    return this.show(message, "info", options);
  }
}

// ============================================================================
// GLOBAL SEARCH FUNCTIONALITY
// ============================================================================

class GlobalSearch {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      placeholder: "Search...",
      minCharacters: 2,
      delay: 300,
      maxResults: 10,
      ...options,
    };

    this.searchData = [];
    this.filteredData = [];
    this.currentIndex = -1;
    this.searchTimeout = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="search-container">
        <div class="search-box">
          <input type="text" class="search-input" placeholder="${this.options.placeholder}">
          <i class='bx bx-search search-icon'></i>
        </div>
        <div class="search-suggestions">
          <div class="search-results"></div>
        </div>
        <!-- <div class="search-filters">
          <div class="search-filter active" data-filter="all">All</div>
          <div class="search-filter" data-filter="users">Users</div>
          <div class="search-filter" data-filter="products">Products</div>
          <div class="search-filter" data-filter="orders">Orders</div>
          <div class="search-filter" data-filter="pages">Pages</div>
        </div> -->
      </div>
    `;
  }

  attachEventListeners() {
    this.input = this.container.querySelector(".search-input");
    this.suggestions = this.container.querySelector(".search-suggestions");
    this.results = this.container.querySelector(".search-results");
    this.filters = this.container.querySelectorAll(".search-filter");

    this.input.addEventListener("input", (e) => {
      this.handleInput(e.target.value);
    });

    this.input.addEventListener("keydown", (e) => {
      this.handleKeydown(e);
    });

    this.input.addEventListener("focus", () => {
      if (this.filteredData.length > 0) {
        this.showSuggestions();
      }
    });

    // Only add filter event listeners if filters exist
    if (this.filters.length > 0) {
      this.filters.forEach((filter) => {
        filter.addEventListener("click", () => {
          this.setActiveFilter(filter);
          this.handleInput(this.input.value);
        });
      });
    }

    // Close suggestions on outside click
    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target)) {
        this.hideSuggestions();
      }
    });
  }

  setSearchData(data) {
    this.searchData = data;
  }

  handleInput(query) {
    clearTimeout(this.searchTimeout);

    if (query.length < this.options.minCharacters) {
      this.hideSuggestions();
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, this.options.delay);
  }

  performSearch(query) {
    // Get active filter if filters exist, otherwise default to "all"
    const activeFilterElement = this.container.querySelector(
      ".search-filter.active"
    );
    const activeFilter = activeFilterElement
      ? activeFilterElement.dataset.filter
      : "all";

    this.filteredData = this.searchData
      .filter((item) => {
        const matchesQuery = this.matchesQuery(item, query);
        const matchesFilter =
          activeFilter === "all" || item.category === activeFilter;
        return matchesQuery && matchesFilter;
      })
      .slice(0, this.options.maxResults);

    this.renderResults(query);
    this.showSuggestions();
    this.currentIndex = -1;
  }

  matchesQuery(item, query) {
    const searchFields = ["title", "description", "tags"];
    return searchFields.some((field) => {
      if (item[field]) {
        return item[field].toLowerCase().includes(query.toLowerCase());
      }
      return false;
    });
  }

  renderResults(query) {
    if (this.filteredData.length === 0) {
      this.results.innerHTML = `
        <div class="search-no-results">
          <i class='bx bx-search-alt search-no-results-icon'></i>
          <div>No results found for "${query}"</div>
        </div>
      `;
      return;
    }

    const groupedResults = this.groupResultsByCategory();
    let html = "";

    Object.keys(groupedResults).forEach((category) => {
      html += `<div class="search-category">${category}</div>`;
      groupedResults[category].forEach((item, index) => {
        html += this.renderSearchItem(item, query, index);
      });
    });

    this.results.innerHTML = html;
    this.attachResultEventListeners();
  }

  groupResultsByCategory() {
    const grouped = {};
    this.filteredData.forEach((item) => {
      const category = item.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  }

  renderSearchItem(item, query, index) {
    const highlightedTitle = this.highlightText(item.title, query);
    const highlightedDescription = this.highlightText(
      item.description || "",
      query
    );

    return `
      <div class="search-item" data-index="${index}" onclick="globalSearch.selectItem(${index})">
        <i class='bx ${item.icon || "bx-file"} search-item-icon'></i>
        <div class="search-item-content">
          <div class="search-item-title">${highlightedTitle}</div>
          ${
            item.description
              ? `<div class="search-item-description">${highlightedDescription}</div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  highlightText(text, query) {
    if (!text || !query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  attachResultEventListeners() {
    const items = this.results.querySelectorAll(".search-item");
    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        this.setHighlightedIndex(index);
      });
    });
  }

  handleKeydown(e) {
    const items = this.results.querySelectorAll(".search-item");

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.currentIndex = Math.min(this.currentIndex + 1, items.length - 1);
        this.setHighlightedIndex(this.currentIndex);
        break;

      case "ArrowUp":
        e.preventDefault();
        this.currentIndex = Math.max(this.currentIndex - 1, -1);
        this.setHighlightedIndex(this.currentIndex);
        break;

      case "Enter":
        e.preventDefault();
        if (this.currentIndex >= 0) {
          this.selectItem(this.currentIndex);
        }
        break;

      case "Escape":
        this.hideSuggestions();
        this.input.blur();
        break;
    }
  }

  setHighlightedIndex(index) {
    const items = this.results.querySelectorAll(".search-item");
    items.forEach((item, i) => {
      item.classList.toggle("highlighted", i === index);
    });
    this.currentIndex = index;
  }

  selectItem(index) {
    const item = this.filteredData[index];
    if (item && this.options.onSelect) {
      this.options.onSelect(item);
    }
    this.hideSuggestions();
    this.input.value = item.title;
  }

  setActiveFilter(filter) {
    // Only manage filter states if filters exist
    if (this.filters.length > 0) {
      this.filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
    }
  }

  showSuggestions() {
    this.suggestions.classList.add("active");
  }

  hideSuggestions() {
    this.suggestions.classList.remove("active");
    this.currentIndex = -1;
  }
}

// ============================================================================
// INITIALIZE GLOBAL INSTANCES
// ============================================================================

// Global instances
let toastManager;
let globalSearch;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  toastManager = new ToastManager();

  // Sample search data
  const searchData = [
    {
      title: "Dashboard",
      description: "Main dashboard page",
      category: "pages",
      icon: "bx-home",
    },
    {
      title: "Products",
      description: "Manage your products",
      category: "pages",
      icon: "bx-cube",
    },
    {
      title: "Orders",
      description: "View and manage orders",
      category: "pages",
      icon: "bx-package",
    },
    {
      title: "Users",
      description: "Manage user accounts",
      category: "pages",
      icon: "bx-user",
    },
    {
      title: "Ahmed Mohamed",
      description: "Customer from Cairo",
      category: "users",
      icon: "bx-user",
    },
    {
      title: "Fatima Ali",
      description: "Customer from Dubai",
      category: "users",
      icon: "bx-user",
    },
    {
      title: "iPhone 14",
      description: "Latest iPhone model",
      category: "products",
      icon: "bx-mobile",
    },
    {
      title: "MacBook Pro",
      description: "Professional laptop",
      category: "products",
      icon: "bx-laptop",
    },
    {
      title: "Order #1234",
      description: "Recent order from Ahmed",
      category: "orders",
      icon: "bx-receipt",
    },
    {
      title: "Order #1235",
      description: "Pending order from Fatima",
      category: "orders",
      icon: "bx-receipt",
    },
  ];

  // Initialize global search if container exists
  const searchContainer = document.getElementById("global-search");
  if (searchContainer) {
    // Get current language from localStorage or default to Arabic
    const currentLang = localStorage.getItem("language") || "ar";
    const searchPlaceholder = currentLang === "ar" ? "بحث" : "Search";

    globalSearch = new GlobalSearch("global-search", {
      placeholder: searchPlaceholder,
      onSelect: (item) => {
        toastManager.info(`Selected: ${item.title}`, {
          title: "Search Result",
        });
      },
    });
    globalSearch.setSearchData(searchData);
  }
});

// Export classes for use in other files
window.TabManager = TabManager;
window.ModernTable = ModernTable;
window.Dropdown = Dropdown;
window.Pagination = Pagination;
window.ToastManager = ToastManager;
window.GlobalSearch = GlobalSearch;
