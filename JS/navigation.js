/* =========================================================
   AURELIA HOTEL — NAVIGATION JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     DROPDOWN NAVIGATION
     ======================================================= */

  const dropdownItems =
    document.querySelectorAll(
      ".navbar-item.dropdown"
    );

  dropdownItems.forEach(
    (dropdown) => {
      const toggle =
        dropdown.querySelector(
          ".dropdown-toggle"
        );

      const menu =
        dropdown.querySelector(
          ".dropdown-menu"
        );

      if (!toggle || !menu) {
        return;
      }

      toggle.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          const isOpen =
            dropdown.classList.contains(
              "is-open"
            );

          dropdownItems.forEach(
            (item) => {
              if (item === dropdown) {
                return;
              }

              item.classList.remove(
                "is-open"
              );

              const otherToggle =
                item.querySelector(
                  ".dropdown-toggle"
                );

              if (otherToggle) {
                otherToggle.setAttribute(
                  "aria-expanded",
                  "false"
                );
              }
            }
          );

          dropdown.classList.toggle(
            "is-open",
            !isOpen
          );

          toggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
          );
        }
      );
    }
  );

  /* =======================================================
     SEARCH PANEL
     ======================================================= */

  const searchToggle =
    document.querySelector(
      ".search-toggle"
    );

  const searchPanel =
    document.querySelector(
      ".search-panel"
    );

  const searchClose =
    document.querySelector(
      ".search-panel-close"
    );

  const searchInput =
    document.querySelector(
      "#nav-search"
    );

  function closeDropdowns() {
    dropdownItems.forEach(
      (dropdown) => {
        dropdown.classList.remove(
          "is-open"
        );

        const toggle =
          dropdown.querySelector(
            ".dropdown-toggle"
          );

        if (toggle) {
          toggle.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      }
    );
  }

  function openSearch() {
    if (
      !searchPanel ||
      !searchToggle
    ) {
      return;
    }

    closeDropdowns();

    searchPanel.classList.add(
      "is-open"
    );

    searchPanel.setAttribute(
      "aria-hidden",
      "false"
    );

    searchToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    if (searchInput) {
      window.setTimeout(
        () => {
          searchInput.focus();
        },
        350
      );
    }
  }

  function closeSearch() {
    if (
      !searchPanel ||
      !searchToggle
    ) {
      return;
    }

    searchPanel.classList.remove(
      "is-open"
    );

    searchPanel.setAttribute(
      "aria-hidden",
      "true"
    );

    searchToggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  if (searchToggle) {
    searchToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    searchToggle.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen =
          searchPanel &&
          searchPanel.classList.contains(
            "is-open"
          );

        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    );
  }

  if (searchClose) {
    searchClose.addEventListener(
      "click",
      () => {
        closeSearch();
      }
    );
  }

  if (searchPanel) {
    searchPanel.addEventListener(
      "click",
      (event) => {
        if (
          event.target === searchPanel
        ) {
          closeSearch();
        }
      }
    );
  }

  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  const mobileToggle =
    document.querySelector(
      ".navbar-mobile-toggle"
    );

  const mobileNavigation =
    document.querySelector(
      ".mobile-navigation"
    );

  const mobileClose =
    document.querySelector(
      ".mobile-navigation-close"
    );

  const mobileLinks =
    document.querySelectorAll(
      ".mobile-navigation-link, .mobile-navigation-cta"
    );

  function openMobileMenu() {
    if (
      !mobileToggle ||
      !mobileNavigation
    ) {
      return;
    }

    closeSearch();

    mobileNavigation.classList.add(
      "is-open"
    );

    mobileToggle.classList.add(
      "is-active"
    );

    mobileToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    document.body.classList.add(
      "menu-open"
    );
  }

  function closeMobileMenu() {
    if (
      !mobileToggle ||
      !mobileNavigation
    ) {
      return;
    }

    mobileNavigation.classList.remove(
      "is-open"
    );

    mobileToggle.classList.remove(
      "is-active"
    );

    mobileToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "menu-open"
    );
  }

  if (mobileToggle) {
    mobileToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    mobileToggle.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen =
          mobileNavigation
            ? mobileNavigation.classList.contains(
                "is-open"
              )
            : false;

        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      }
    );
  }

  if (mobileClose) {
    mobileClose.addEventListener(
      "click",
      () => {
        closeMobileMenu();
      }
    );
  }

  mobileLinks.forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          closeMobileMenu();
        }
      );
    }
  );

  /* =======================================================
     NAVIGATION SCROLL STATE
     ======================================================= */

  const siteHeader =
    document.querySelector(
      ".site-header"
    );

  function updateNavigationOnScroll() {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle(
      "is-scrolled",
      window.scrollY > 40
    );
  }

  window.addEventListener(
    "scroll",
    updateNavigationOnScroll,
    {
      passive: true
    }
  );

  updateNavigationOnScroll();

  /* =======================================================
     HERO CAROUSEL
     ======================================================= */

  const heroSection =
    document.querySelector(
      ".hero-section"
    );

  if (heroSection) {
    const heroSlides =
      heroSection.querySelectorAll(
        ".hero-slide"
      );

    const heroPrevButton =
      heroSection.querySelector(
        ".hero-slider-arrow--prev"
      );

    const heroNextButton =
      heroSection.querySelector(
        ".hero-slider-arrow--next"
      );

    const heroIndicators =
      heroSection.querySelectorAll(
        ".hero-slider-indicator"
      );

    let currentHeroSlide = 0;
    let heroAutoplayTimer = null;

    function showHeroSlide(index) {
      if (!heroSlides.length) {
        return;
      }

      if (index < 0) {
        currentHeroSlide =
          heroSlides.length - 1;
      } else if (
        index >= heroSlides.length
      ) {
        currentHeroSlide = 0;
      } else {
        currentHeroSlide = index;
      }

      heroSlides.forEach(
        (slide, slideIndex) => {
          const isActive =
            slideIndex ===
            currentHeroSlide;

          slide.classList.toggle(
            "hero-slide--active",
            isActive
          );

          slide.setAttribute(
            "aria-hidden",
            String(!isActive)
          );
        }
      );

      heroIndicators.forEach(
        (
          indicator,
          indicatorIndex
        ) => {
          const isActive =
            indicatorIndex ===
            currentHeroSlide;

          indicator.classList.toggle(
            "hero-slider-indicator--active",
            isActive
          );

          indicator.setAttribute(
            "aria-selected",
            String(isActive)
          );
        }
      );
    }

    if (heroPrevButton) {
      heroPrevButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          showHeroSlide(
            currentHeroSlide - 1
          );
        }
      );
    }

    if (heroNextButton) {
      heroNextButton.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          showHeroSlide(
            currentHeroSlide + 1
          );
        }
      );
    }

    heroIndicators.forEach(
      (indicator) => {
        indicator.addEventListener(
          "click",
          (event) => {
            event.preventDefault();

            const slideIndex =
              Number(
                indicator.dataset.slide
              );

            if (
              Number.isNaN(
                slideIndex
              )
            ) {
              return;
            }

            showHeroSlide(
              slideIndex
            );
          }
        );
      }
    );

    heroSection.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key ===
          "ArrowLeft"
        ) {
          showHeroSlide(
            currentHeroSlide - 1
          );
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          showHeroSlide(
            currentHeroSlide + 1
          );
        }
      }
    );

    function stopHeroAutoplay() {
      if (
        !heroAutoplayTimer
      ) {
        return;
      }

      window.clearInterval(
        heroAutoplayTimer
      );

      heroAutoplayTimer =
        null;
    }

    function startHeroAutoplay() {
      stopHeroAutoplay();

      if (
        heroSlides.length < 2
      ) {
        return;
      }

      heroAutoplayTimer =
        window.setInterval(
          () => {
            showHeroSlide(
              currentHeroSlide + 1
            );
          },
          6000
        );
    }

    heroSection.addEventListener(
      "mouseenter",
      stopHeroAutoplay
    );

    heroSection.addEventListener(
      "mouseleave",
      startHeroAutoplay
    );

    heroSection.addEventListener(
      "focusin",
      stopHeroAutoplay
    );

    heroSection.addEventListener(
      "focusout",
      startHeroAutoplay
    );

    showHeroSlide(0);

    startHeroAutoplay();
  }

  /* =======================================================
     GLOBAL CLICK / ESCAPE
     ======================================================= */

  document.addEventListener(
    "click",
    (event) => {
      dropdownItems.forEach(
        (dropdown) => {
          if (
            !dropdown.contains(
              event.target
            )
          ) {
            dropdown.classList.remove(
              "is-open"
            );

            const toggle =
              dropdown.querySelector(
                ".dropdown-toggle"
              );

            if (toggle) {
              toggle.setAttribute(
                "aria-expanded",
                "false"
              );
            }
          }
        }
      );
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !== "Escape"
      ) {
        return;
      }

      closeDropdowns();
      closeSearch();
      closeMobileMenu();
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > 900
      ) {
        closeMobileMenu();
      }
    }
  );
});


/* SEARCH PANEL -> SEARCH RESULTS
   Add this block at the END of navigation.js. */
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".search-form").forEach(form=>{if(form.dataset.searchResultsBound==="true")return;form.dataset.searchResultsBound="true";form.addEventListener("submit",event=>{const input=form.querySelector("#nav-search");if(!input)return;event.preventDefault();const q=input.value.trim();window.location.href=q?`search.html?q=${encodeURIComponent(q)}`:"search.html"})})});



/* AURELIA ACCOUNT / USER MENU PATCH
   Add this block at the END of js/navigation.js.
   Do NOT replace the existing navigation.js. */

document.addEventListener("DOMContentLoaded", () => {
    const account = document.querySelector(".navbar-user");
    const toggle = account?.querySelector(".user-toggle");
    const menu = account?.querySelector(".dropdown-menu");

    if (!account || !toggle || !menu) return;

    const isLoggedIn = () =>
        localStorage.getItem("aureliaLoggedIn") === "true";

    const getAccount = () => {
        try {
            return JSON.parse(localStorage.getItem("aureliaAccount") || "null") || {};
        } catch {
            return {};
        }
    };

    const escapeHTML = (value) =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
        }[char]));

    const closeAccountMenu = () => {
        account.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    const bindSignOut = () => {
        const button = menu.querySelector(".account-signout");
        if (!button || button.dataset.bound === "true") return;
        button.dataset.bound = "true";
        button.addEventListener("click", () => {
            localStorage.setItem("aureliaLoggedIn", "false");
            closeAccountMenu();
            renderAccountMenu();
            renderMobileAccount();
        });
    };

    const renderAccountMenu = () => {
        const loggedIn = isLoggedIn();
        const user = getAccount();
        const firstName = user.firstName || "Guest";

        menu.innerHTML = loggedIn
            ? `
                <div class="account-menu-heading">
                    <span class="account-menu-kicker">Aurelia Account</span>
                    <strong>${escapeHTML(firstName)}</strong>
                </div>
                <a href="dashboard.html" class="dropdown-link">My Dashboard</a>
                <a href="profile.html" class="dropdown-link">My Profile</a>
                <a href="bookings.html" class="dropdown-link">My Bookings</a>
                <a href="favorites.html" class="dropdown-link">Favorites</a>
                <a href="search-history.html" class="dropdown-link">Search History</a>
                <a href="settings.html" class="dropdown-link">Settings</a>
                <button type="button" class="dropdown-link account-signout">Sign Out</button>
            `
            : `
                <div class="account-menu-heading">
                    <span class="account-menu-kicker">Aurelia Account</span>
                    <strong>Welcome.</strong>
                </div>
                <a href="login.html" class="dropdown-link">Sign In</a>
                <a href="signup.html" class="dropdown-link">Create Account</a>
            `;

        bindSignOut();
    };

    const renderMobileAccount = () => {
        const content = document.querySelector(".mobile-navigation-content");
        const divider = content?.querySelector(".mobile-navigation-divider");
        if (!content || !divider) return;

        content.querySelectorAll("[data-mobile-account]").forEach(el => el.remove());

        const links = isLoggedIn()
            ? [
                ["My Dashboard","dashboard.html"],
                ["My Profile","profile.html"],
                ["My Bookings","bookings.html"],
                ["Favorites","favorites.html"],
                ["Search History","search-history.html"],
                ["Settings","settings.html"]
              ]
            : [
                ["Sign In","login.html"],
                ["Create Account","signup.html"]
              ];

        let last = divider;

        links.forEach(([label, href]) => {
            const a = document.createElement("a");
            a.href = href;
            a.className = "mobile-navigation-link";
            a.dataset.mobileAccount = "true";
            a.textContent = label;
            last.after(a);
            last = a;
        });

        if (isLoggedIn()) {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "mobile-navigation-link mobile-account-signout";
            b.dataset.mobileAccount = "true";
            b.textContent = "Sign Out";
            b.addEventListener("click", () => {
                localStorage.setItem("aureliaLoggedIn", "false");
                renderAccountMenu();
                renderMobileAccount();
            });
            last.after(b);
        }
    };

    toggle.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        document.querySelectorAll(".navbar-item.dropdown.is-open")
            .forEach(item => {
                item.classList.remove("is-open");
                item.querySelector(".dropdown-toggle")
                    ?.setAttribute("aria-expanded", "false");
            });

        const open = account.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", event => {
        if (!account.contains(event.target)) closeAccountMenu();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeAccountMenu();
    });

    renderAccountMenu();
    renderMobileAccount();

    window.addEventListener("storage", () => {
        renderAccountMenu();
        renderMobileAccount();
    });
});