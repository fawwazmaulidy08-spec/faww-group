"use strict";

document.documentElement.classList.add("js-enabled");

// Keep this number in sync with the WhatsApp links in index.html if it changes.
const WHATSAPP_NUMBER = "6283842709664";

const priceData = {
  laptop: [
    { name: "Pembersihan & optimasi", detail: "Termasuk pemeriksaan dasar", price: "Mulai Rp75.000" },
    { name: "Instalasi sistem operasi", detail: "Driver dan aplikasi dasar", price: "Mulai Rp100.000" },
    { name: "Upgrade RAM / SSD", detail: "Belum termasuk harga komponen", price: "Mulai Rp50.000" },
    { name: "Perbaikan perangkat keras", detail: "Layar, keyboard, baterai, motherboard", price: "Setelah diagnosa" }
  ],
  pc: [
    { name: "Diagnosa & troubleshooting", detail: "Pemeriksaan awal kerusakan", price: "Gratis" },
    { name: "Rakit / bongkar PC", detail: "Belum termasuk komponen", price: "Mulai Rp100.000" },
    { name: "Upgrade RAM / SSD", detail: "Termasuk pemasangan", price: "Mulai Rp50.000" },
    { name: "Instalasi sistem operasi", detail: "Driver dan aplikasi dasar", price: "Mulai Rp100.000" }
  ],
  printer: [
    { name: "Pemeriksaan & pembersihan", detail: "Pengecekan kondisi printer", price: "Mulai Rp50.000" },
    { name: "Atasi kertas macet", detail: "Biaya menyesuaikan kondisi", price: "Mulai Rp75.000" },
    { name: "Isi ulang tinta", detail: "Harga bergantung tipe printer", price: "Mulai Rp25.000" },
    { name: "Instalasi driver / Wi-Fi", detail: "Pengaturan pada satu perangkat", price: "Mulai Rp50.000" }
  ],
  software: [
    { name: "Instalasi sistem operasi", detail: "Driver dan aplikasi dasar", price: "Mulai Rp100.000" },
    { name: "Pembersihan virus & malware", detail: "Pemeriksaan dan optimasi dasar", price: "Mulai Rp75.000" },
    { name: "Backup data", detail: "Belum termasuk media penyimpanan", price: "Mulai Rp75.000" },
    { name: "Pemulihan data", detail: "Estimasi setelah pemeriksaan media", price: "Setelah diagnosa" }
  ]
};

const priceList = document.querySelector("#price-list");
const priceTabs = [...document.querySelectorAll(".price-tab")];

function renderPrices(category) {
  if (!priceList || !priceData[category]) return;
  priceList.replaceChildren();
  priceData[category].forEach((item) => {
    const row = document.createElement("div");
    row.className = "price-row";
    const name = document.createElement("div");
    name.className = "price-name";
    const title = document.createElement("strong");
    title.textContent = item.name;
    const detail = document.createElement("small");
    detail.textContent = item.detail;
    name.append(title, detail);
    const price = document.createElement("span");
    price.className = "price-value";
    price.textContent = item.price;
    row.append(name, price);
    priceList.append(row);
  });
  const selectedTab = priceTabs.find((tab) => tab.dataset.category === category);
  if (selectedTab) priceList.setAttribute("aria-labelledby", selectedTab.id);
}

renderPrices("laptop");

priceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    priceTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    renderPrices(tab.dataset.category);
  });
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % priceTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + priceTabs.length) % priceTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = priceTabs.length - 1;
    priceTabs[nextIndex].focus();
    priceTabs[nextIndex].click();
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu navigasi");
  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Buka menu navigasi" : "Tutup menu navigasi");
    siteNav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });
  siteNav.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]:not(.nav-booking)')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        if (isCurrent) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
        link.classList.toggle("active", isCurrent);
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  observedSections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const backToTop = document.querySelector(".back-to-top");
function updateBackToTop() {
  if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 600);
}
window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("fawwgroup-theme");
if (savedTheme === "dark") document.body.classList.add("dark-theme");
function updateThemeLabel() {
  if (!themeToggle) return;
  const dark = document.body.classList.contains("dark-theme");
  themeToggle.setAttribute("aria-label", dark ? "Aktifkan tema terang" : "Aktifkan tema gelap");
}
updateThemeLabel();
themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const dark = document.body.classList.contains("dark-theme");
  localStorage.setItem("fawwgroup-theme", dark ? "dark" : "light");
  updateThemeLabel();
});

const bookingForm = document.querySelector("#booking-form");
const formMessage = document.querySelector("#form-message");
const bookingFieldNames = ["nama", "telepon", "email", "perangkat", "keluhan"];

function showFieldError(field, message) {
  const error = document.querySelector(`#error-${field.name}`);
  if (error) error.textContent = message;
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function validateBookingField(field) {
  const value = field.value.trim();
  let message = "";
  if (field.required && !value) {
    message = "Bagian ini wajib diisi.";
  } else if (field.name === "telepon" && value) {
    const normalized = value.replace(/[\s().-]/g, "").replace(/^\+/, "");
    if (!/^(?:0|62)8\d{8,11}$/.test(normalized)) {
      message = "Masukkan nomor HP Indonesia yang valid, misalnya 0812-3456-7890.";
    }
  } else if (field.name === "email" && value && !field.validity.valid) {
    message = "Masukkan alamat email dengan format yang benar.";
  }
  showFieldError(field, message);
  return !message;
}

bookingFieldNames.forEach((name) => {
  const field = bookingForm?.elements.namedItem(name);
  if (!field) return;
  field.addEventListener("blur", () => validateBookingField(field));
  field.addEventListener("input", () => {
    if (field.hasAttribute("aria-invalid")) validateBookingField(field);
  });
  field.addEventListener("change", () => {
    if (field.hasAttribute("aria-invalid")) validateBookingField(field);
  });
});

function formatPreferredDate(value) {
  if (!value) return "Belum ditentukan";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
}

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (formMessage) formMessage.textContent = "";
  const fields = bookingFieldNames
    .map((name) => bookingForm.elements.namedItem(name))
    .filter(Boolean);
  const valid = fields.map(validateBookingField).every(Boolean);
  if (!valid) {
    bookingForm.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const values = new FormData(bookingForm);
  const phone = String(values.get("telepon")).trim();
  const message = [
    "Halo Faww Group, saya ingin booking servis.",
    "",
    `Nama: ${String(values.get("nama")).trim()}`,
    `Nomor WhatsApp: ${phone}`,
    `Email: ${String(values.get("email") || "").trim() || "Tidak diisi"}`,
    `Jenis perangkat: ${String(values.get("perangkat"))}`,
    `Merek / model: ${String(values.get("model") || "").trim() || "Belum diketahui"}`,
    `Keluhan: ${String(values.get("keluhan")).trim()}`,
    `Tanggal yang diinginkan: ${formatPreferredDate(String(values.get("tanggal") || ""))}`,
    `Antar-jemput / kunjungan: ${values.has("jemput") ? "Ya, mohon dikonfirmasi" : "Tidak"}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  if (formMessage) {
    formMessage.textContent = "Booking siap dikirim. Jika WhatsApp tidak terbuka, ";
    const link = document.createElement("a");
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "buka pesan WhatsApp ini";
    formMessage.append(link, ".");
  }
});

const reviewCards = [...document.querySelectorAll(".testimonial-card")];
const sliderCounter = document.querySelector(".slider-counter");
const sliderStage = document.querySelector(".testimonial-stage");
let currentReview = 0;

function showReview(nextIndex) {
  if (!reviewCards.length) return;
  currentReview = (nextIndex + reviewCards.length) % reviewCards.length;
  reviewCards.forEach((card, index) => {
    const active = index === currentReview;
    card.classList.toggle("is-current", active);
    card.setAttribute("aria-hidden", String(!active));
    card.inert = !active;
  });
  if (sliderCounter) {
    sliderCounter.innerHTML = `<span>${String(currentReview + 1).padStart(2, "0")}</span> <i>/</i> ${String(reviewCards.length).padStart(2, "0")}`;
  }
}

document.querySelector('[data-slide="prev"]')?.addEventListener("click", () => showReview(currentReview - 1));
document.querySelector('[data-slide="next"]')?.addEventListener("click", () => showReview(currentReview + 1));
sliderStage?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") event.preventDefault();
  if (event.key === "ArrowLeft") showReview(currentReview - 1);
  if (event.key === "ArrowRight") showReview(currentReview + 1);
});

const statusForm = document.querySelector("#status-form");
const statusResult = document.querySelector("#status-result");
statusForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const ticket = String(new FormData(statusForm).get("ticket") || "").trim();
  if (!ticket) {
    statusResult.textContent = "Masukkan nomor tiket terlebih dahulu.";
    statusForm.elements.namedItem("ticket").focus();
    return;
  }
  statusResult.textContent = `Contoh status untuk tiket ${ticket}: perangkat sedang dalam pemeriksaan. Ini hanya data demo; konfirmasi status sebenarnya melalui WhatsApp.`;
});

const yearElement = document.querySelector("#current-year");
if (yearElement) yearElement.textContent = String(new Date().getFullYear());

const preferredDate = document.querySelector("#tanggal");
if (preferredDate) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  preferredDate.min = localToday;
}
