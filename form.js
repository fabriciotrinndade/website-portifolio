/* ================ FUNCIONALIDADE FORMULÁRIO CONTATO GOOGLE SHEET ================ */

const scriptURL = 'https://script.google.com/macros/s/AKfycbzO352Q0ytD1AKY1DvdD3hg2uTKxWpeb_QKT-oYXZmof4B5Zq85_k6y5fsiFEtlRjfIfA/exec'
const form = document.forms['submit-to-google-sheet']

const msg = document.getElementById('msg')

let currentLang = "pt"; // idioma padrão

// troca o idioma
document.querySelectorAll("[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    currentLang = btn.getAttribute("data-lang");
  });
});

// mensagens em cada idioma
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

//envio do formulário
form.addEventListener("submit", e => {
  e.preventDefault();

  //save dados antes de limpar
  const formData = new FormData(form);

  //mensagem instantânea
  msg.innerHTML = messages[currentLang].success;

  //limpa o formulário imediatamente
  form.reset();
  
  //limpa mensagem em 2s
  setTimeout(() => (msg.innerHTML = ""), 2000);

  fetch(scriptURL, { method: "POST", body: formData })
    .catch(() => {
      msg.innerHTML = messages[currentLang].error;
    });
});

/* ================ EFEITO NAVBAR (MANTER ATIVO) ================ */

window.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  if (!header) return; // evita erro se não existir

  window.addEventListener("scroll", () => {
    header.classList.toggle("sticky", window.scrollY > 0);
  });
});

let elActiveAnchor = null;

function toggleMenu(elAnchor) {
  elActiveAnchor?.classList.remove('active');
  (elActiveAnchor = elAnchor).classList.add('active');
}

toggleMenu(document.getElementById("menu-home"));

// alterar item navbar ao rolar pagina

const menuLinks = document.querySelectorAll('.menu-link');

window.addEventListener('scroll', () => {
    let current = '';

    menuLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        const sectionTop = section.offsetTop - 200; // ajuste do topo
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

/* ================ ALTERAR PT / EN ================ */

let textsEn = {}; // variavel global que vai receber o JSON

// guarda os textos originais do HTML (PT)
const originalTexts = {};
document.querySelectorAll("[data-text]").forEach(el => {
  const key = el.getAttribute("data-text");

  // armazena placeholder se for input/textarea, senão textContent
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    originalTexts[key] = el.placeholder;
  } else {
    originalTexts[key] = el.textContent;
  }
});


// função para mudar idioma
function changeLang(lang) {
  document.querySelectorAll("[data-text]").forEach(el => {
    const key = el.getAttribute("data-text");

    // inputs e textareas usam placeholder
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      if (lang === "en") {
        el.placeholder = textsEn[key] || originalTexts[key];
      } else {
        el.placeholder = originalTexts[key];
      }
    } else { // elementos normais usam textcontent
      if (lang === "en") {
        el.textContent = textsEn[key] || originalTexts[key];
      } else {
        el.textContent = originalTexts[key];
      }
    }
  });
}


// inicializa botões
document.querySelectorAll("button[data-lang]").forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    changeLang(lang);

    // atualiza classe ativa
    document.querySelectorAll("button[data-lang]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// define idioma padrão (PT)
const defaultBtn = document.querySelector('button[data-lang="pt"]');
defaultBtn.classList.add("active");
changeLang("pt");

// carrega o arquivo JSON com os textos em inglês
fetch('textsEn.json')
  .then(response => response.json())
  .then(data => {
    textsEn = data; // armazena os textos do JSON
  })
  .catch(err => console.error("Erro ao carregar o JSON:", err));
