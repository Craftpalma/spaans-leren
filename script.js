/* =========================================
   MENÚ MÓVIL
========================================= */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

menuButton.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});


/* Cerrar menú al pulsar un enlace */

const navLinks = document.querySelectorAll(".nav a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});


/* =========================================
   AÑO DEL FOOTER
========================================= */

const year = document.getElementById("year");

year.textContent = new Date().getFullYear();


/* =========================================
   MODAL DE CURSOS
========================================= */

const courseButtons =
    document.querySelectorAll(".course-button, .price-interest");

const modal =
    document.getElementById("courseModal");

const modalClose =
    document.getElementById("modalClose");

const selectedCourse =
    document.getElementById("selectedCourse");

const modalContact =
    document.getElementById("modalContact");


courseButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const course =
            button.getAttribute("data-course");

        selectedCourse.textContent = course;

        modal.classList.add("active");

    });

});


/* Cerrar modal */

modalClose.addEventListener("click", () => {

    modal.classList.remove("active");

});


/* Cerrar haciendo clic fuera */

modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.remove("active");

    }

});


/* =========================================
   BOTÓN DEL MODAL
========================================= */

modalContact.addEventListener("click", () => {

    modal.classList.remove("active");

});


/* =========================================
   FORMULARIO
========================================= */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("name").value;

    const course =
        document.getElementById("course").value;


    /*
        DE MOMENTO NO ENVIAMOS NADA.

        Más adelante podemos conectar este formulario
        con:

        - Email
        - WhatsApp
        - Google Sheets
        - Formspree
        - Supabase
        - Nuestro agente IA
    */


    alert(
        `¡Gracias, ${name}!\n\n` +
        `Hemos recibido tu consulta` +
        (course ? ` sobre ${course}.` : ".")
    );


    contactForm.reset();

});


/* =========================================
   ESCAPE PARA CERRAR EL MODAL
========================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        modal.classList.remove("active");

    }

});
