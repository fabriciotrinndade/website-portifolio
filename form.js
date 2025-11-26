const scriptURL = 'https://script.google.com/macros/s/AKfycbzO352Q0ytD1AKY1DvdD3hg2uTKxWpeb_QKT-oYXZmof4B5Zq85_k6y5fsiFEtlRjfIfA/exec';
const form = document.forms['submit-to-google-sheet'];
const msg = document.getElementById('msg');

let currentLang = "pt"; // idioma padrão
let textsEn = {};       // textos carregados do JSON
const originalTexts = {}; // textos originais (PT)


/* ========== FORMULÁRIO GOOGLE SHEETS ========== */

const messages = {
  pt: {
    success: "Mensagem enviada com sucesso!",
    error: "Erro ao enviar. Tente novamente."
  },
  en: {
    success: "Message sent successfully!",
    error: "Error sending message. Please try again."
  }
};

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(form);

  // feedback instantâneo
  msg.textContent = messages[currentLang].success;

  // limpa form
  form.reset();

  // remove mensagem depois de 2s
  setTimeout(() => (msg.textContent = ""), 2000);

  fetch(scriptURL, { method: "POST", body: formData })
    .catch(() => {
      msg.textContent = messages[currentLang].error;
    });
}

form.addEventListener("submit", handleFormSubmit);


/* ========== NAVBAR ATIVA ========== */

// sticky header
window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 0);
  });
});

// controle manual do menu
let elActiveAnchor = null;
function toggleMenu(elAnchor) {
  elActiveAnchor?.classList.remove('active');
  (elActiveAnchor = elAnchor).classList.add('active');
}
toggleMenu(document.getElementById("menu-home"));

// ativa menu ao rolar
const menuLinks = document.querySelectorAll('.menu-link');

window.addEventListener('scroll', () => {
  let current = '';

  menuLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = link.getAttribute('href');
    }
  });

  menuLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
    }
  });
});


/* ========== PT/EN ========== */

// salvar textos originais (PT)
document.querySelectorAll("[data-text]").forEach(el => {
  const key = el.getAttribute("data-text");
  originalTexts[key] = (el.tagName === "INPUT" || el.tagName === "TEXTAREA")
    ? el.placeholder
    : el.textContent;
});

// trocar idioma
function changeLang(lang) {
  currentLang = lang;

  document.querySelectorAll("[data-text]").forEach(el => {
    const key = el.getAttribute("data-text");
    const text = (lang === "en") ? textsEn[key] || originalTexts[key] : originalTexts[key];

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = text;
    } else {
      el.textContent = text;
    }
  });
}

// botões de idioma
document.querySelectorAll("button[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    changeLang(btn.dataset.lang);

    document.querySelectorAll("button[data-lang]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ativa PT ao carregar
document.querySelector('button[data-lang="pt"]').classList.add("active");
changeLang("pt");

// carrega JSON EN
fetch('textsEn.json')
  .then(res => res.json())
  .then(data => (textsEn = data))
  .catch(err => console.error("Erro ao carregar o JSON:", err));
