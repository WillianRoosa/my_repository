// ======= TRADUÇÕES =======
const translations = {
    en: {
        nav_about: "About",
        nav_projects: "Projects",
        nav_contact: "Contact",
        hero_title: "Hi, I'm Willian Rosa",
        hero_subtitle: "Backend Developer passionate about building scalable applications.",
        hero_btn: "See My Work",
        about_title: "About Me",
        about_text: "I am a backend developer with experience in Java, Spring Boot, and REST APIs. I love creating clean, efficient, and scalable code.",
        projects_title: "Projects",
        project1_desc: "A REST API for managing tasks with Spring Boot and MySQL.",
        project2_desc: "Fullstack app with Java backend and responsive frontend.",
        contact_title: "Contact Me",
        contact_name: "Name",
        contact_email: "Email",
        contact_phone: "Phone",
        contact_message: "Message",
        contact_btn: "Send"
    },
    pt: {
        nav_about: "Sobre",
        nav_projects: "Projetos",
        nav_contact: "Contato",
        hero_title: "Olá, eu sou Willian Rosa",
        hero_subtitle: "Desenvolvedor backend apaixonado por criar aplicações escaláveis.",
        hero_btn: "Ver Meus Trabalhos",
        about_title: "Sobre Mim",
        about_text: "Sou desenvolvedor backend com experiência em Java, Spring Boot e APIs REST. Amo criar código limpo, eficiente e escalável.",
        projects_title: "Projetos",
        project1_desc: "Uma API REST para gerenciar tarefas com Spring Boot e MySQL.",
        project2_desc: "Aplicativo fullstack com backend em Java e frontend responsivo.",
        contact_title: "Fale Comigo",
        contact_name: "Nome",
        contact_email: "E-mail",
        contact_phone: "Telefone",
        contact_message: "Mensagem",
        contact_btn: "Enviar"
    }
};

function setLanguage(lang) {
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        el.textContent = translations[lang][key];
    });
    document.querySelectorAll("[data-lang-placeholder]").forEach(el => {
        const key = el.getAttribute("data-lang-placeholder");
        el.placeholder = translations[lang][key];
    });
}
setLanguage("en");

// ======= ANIMAÇÕES AO SCROLL =======
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const anim = entry.target.dataset.animation || "fadeInUp";
            entry.target.style.animation = `${anim} 0.8s ease forwards`;
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".scroll-animation").forEach(el => observer.observe(el));

// ======= SCROLL SUAVE =======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ======= MÁSCARA DE TELEFONE (BR) + E.164 =======
const form = document.querySelector("#contact-form");
const phoneInput = document.querySelector('input[name="phone_display"]');
const phoneHidden = document.querySelector('#phone_e164');

function formatBrazilPhone(digits) {
    const d = digits.slice(0, 11);
    if (!d) return "";
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function toE164Brazil(digits) {
    const d = digits.replace(/\D/g, "");
    if (d.length === 10 || d.length === 11) return `+55${d}`;
    if (d.startsWith("55") && (d.length === 12 || d.length === 13)) return `+${d}`;
    return "";
}

phoneInput.addEventListener("input", (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    e.target.value = formatBrazilPhone(raw);
    phoneHidden.value = toE164Brazil(raw);
});

// ======= ENVIO DO FORMULÁRIO =======
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const raw = phoneInput.value.replace(/\D/g, "");
    const e164 = toE164Brazil(raw);
    if (!e164) {
        phoneInput.focus();
        alert("Digite um telefone válido (ex.: (11) 98888-7777).");
        return;
    }
    phoneHidden.value = e164;

    const statusEl = document.getElementById("form-status");
    statusEl.textContent = "Sending...";

    const formData = {
        name: form.elements["name"].value,
        email: form.elements["email"].value,
        phone: form.elements["phone_display"].value,
        message: form.elements["message"].value
    };

    console.log("Dados enviados:", formData);

    try {
        const res = await fetch("http://localhost:8080/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            statusEl.textContent = "✅ Message sent successfully!";
            form.reset();
            phoneHidden.value = "";
        } else {
            statusEl.textContent = "❌ Failed to send. Try again later.";
        }
    } catch (err) {
        statusEl.textContent = "❌ Connection error.";
    }
});