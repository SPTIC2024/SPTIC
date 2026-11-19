const header = document.querySelector(".site-header");
const menu = header.querySelector(".site-menu");
const navigation = document.getElementById("site-navigation");
const mobileNavigation = window.matchMedia("(max-width: 991px)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const servedOverHttp = /^https?:$/.test(location.protocol);
if (servedOverHttp) {
  const viewTransitionStyle = document.createElement("style");
  viewTransitionStyle.media = "(prefers-reduced-motion: no-preference)";
  viewTransitionStyle.textContent = "@view-transition { navigation: auto; }";
  document.head.append(viewTransitionStyle);
}

function setMenu(open) {
  menu.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
  navigation.inert = mobileNavigation.matches && !open;
}

header.classList.add("menu-ready");
setMenu(false);
mobileNavigation.addEventListener("change", () => setMenu(false));
menu.addEventListener("click", () => {
  header.classList.add("menu-interacted");
  setMenu(menu.getAttribute("aria-expanded") === "false");
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
header.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    menu.focus();
  }
});

function openLinkedRequirement() {
  const target = document.getElementById(location.hash.slice(1));
  if (target?.matches(".requirement")) target.open = true;
}

const initialRequirementHash = location.hash;
if (initialRequirementHash && !reduceMotion.matches) {
  function openAfterPaint() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (location.hash === initialRequirementHash) openLinkedRequirement();
    }));
  }

  if (servedOverHttp && "onpagereveal" in window) {
    window.addEventListener("pagereveal", async (event) => {
      await event.viewTransition?.finished.catch(() => {});
      openAfterPaint();
    }, { once: true });
  } else {
    openAfterPaint();
  }
} else {
  openLinkedRequirement();
}
window.addEventListener("hashchange", openLinkedRequirement);

const backToTop = document.querySelector(".back-to-top");
function updateBackToTop() {
  backToTop.classList.toggle("active", window.scrollY > 350);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

if (typeof GLightbox === "function") GLightbox();

if (typeof AOS !== "undefined") {
  AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });

  let refreshTimer;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => AOS.refresh(), 150);
  });
  resizeObserver.observe(document.querySelector("main"));
}

const filters = document.querySelectorAll(".facility-filter");
const facilities = [...document.querySelectorAll(".facility-card")];
const facilityAnimations = new Map();
document.querySelector(".facility-filters")?.classList.add("is-ready");
filters.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.getAttribute("aria-pressed") === "true") return;

    const previous = new Map();
    if (!reduceMotion.matches) {
      facilities.filter((card) => !card.hidden).forEach((card) => {
        previous.set(card, card.getBoundingClientRect());
      });
    }
    facilityAnimations.forEach((animation) => animation.cancel());
    facilityAnimations.clear();
    filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    facilities.forEach((facility) => {
      facility.hidden = button.dataset.category !== "all" && facility.dataset.category !== button.dataset.category;
    });
    if (reduceMotion.matches) return;

    const visible = facilities.filter((card) => !card.hidden);
    const positions = visible.map((card) => card.getBoundingClientRect());
    visible.forEach((card, index) => {
      const before = previous.get(card);
      const after = positions[index];
      const x = before ? before.left - after.left : 0;
      const y = before ? before.top - after.top : 10;
      if (before && !x && !y) return;

      const animation = card.animate(
        [{ transform: `translate(${x}px, ${y}px)`, opacity: before ? 1 : .2 },
          { transform: "translate(0, 0)", opacity: 1 }],
        { duration: 320, easing: "cubic-bezier(.2, .7, .3, 1)" }
      );
      facilityAnimations.set(card, animation);
      animation.onfinish = () => facilityAnimations.delete(card);
    });
  });
});

reduceMotion.addEventListener("change", () => {
  if (!reduceMotion.matches) return;
  facilityAnimations.forEach((animation) => animation.cancel());
  facilityAnimations.clear();
});

const contactForm = document.querySelector(".php-email-form");
contactForm?.addEventListener("submit", (event) => {
  if (window.hcaptcha?.getResponse?.()) return;

  event.preventDefault();
  const message = contactForm.querySelector(".captcha-message");
  message.textContent = window.hcaptcha
    ? "Complete the verification before sending your message."
    : "Verification is unavailable. Please try again or contact the school by email.";
  message.hidden = false;
});
