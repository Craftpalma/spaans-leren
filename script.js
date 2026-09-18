/* =========================================
   MENÚ MÓVIL
========================================= */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}


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

if (year) {
    year.textContent = new Date().getFullYear();
}


/* =========================================
   CHATBOT
========================================= */

const chatbotButton =
    document.getElementById("chatbotButton");

const chatbotWindow =
    document.getElementById("chatbotWindow");

const chatbotClose =
    document.getElementById("chatbotClose");

const chatbotInput =
    document.getElementById("chatbotInput");

const chatbotSend =
    document.getElementById("chatbotSend");

const chatbotMessages =
    document.getElementById("chatbotMessages");


/* Abrir chatbot */

if (chatbotButton) {
    chatbotButton.addEventListener("click", () => {
        chatbotWindow.classList.toggle("active");
    });
}


/* Cerrar chatbot */

if (chatbotClose) {
    chatbotClose.addEventListener("click", () => {
        chatbotWindow.classList.remove("active");
    });
}


/* =========================================
   AÑADIR MENSAJE AL CHAT
========================================= */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.classList.add(
        type === "user"
            ? "user-message"
            : "bot-message"
    );

    message.textContent = text;

    chatbotMessages.appendChild(message);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;
}


/* =========================================
   RESPUESTAS TEMPORALES
========================================= */

function getBotResponse(question) {

    const text = question.toLowerCase();


    if (
        text.includes("curso") ||
        text.includes("nivel")
    ) {

        return "Tenemos cursos desde A1 hasta B2, además de conversación, cursos para fines específicos y español para negocios.";

    }


    if (
        text.includes("precio") ||
        text.includes("precios") ||
        text.includes("cuesta") ||
        text.includes("coste")
    ) {

        return "La clase de diagnóstico de 30 minutos es gratuita. También tenemos un pack de 5 clases por 110 € y un pack de 10 clases por 200 €.";

    }


    if (
        text.includes("prueba") ||
        text.includes("diagnóstico") ||
        text.includes("gratis")
    ) {

        return "La clase de diagnóstico es gratuita y dura 30 minutos. Sirve para conocer tu nivel y establecer tus objetivos.";

    }


    if (
        text.includes("reserv") ||
        text.includes("clase")
    ) {

        return "¡Perfecto! Podemos ayudarte a reservar una clase. Para empezar, dime tu nombre y qué curso te interesa.";

    }


    if (
        text.includes("hola") ||
        text.includes("buenas")
    ) {

        return "¡Hola! 👋 Encantado de ayudarte. Puedes preguntarme sobre cursos, precios o la clase de prueba gratuita.";

    }


    return "¡Gracias por tu pregunta! 😊 De momento estoy aprendiendo. Puedes preguntarme por nuestros cursos, precios o la clase de prueba gratuita.";

}


/* =========================================
   ENVIAR MENSAJE
========================================= */

function sendMessage() {

    const text =
        chatbotInput.value.trim();


    if (text === "") {
        return;
    }


    /* Mensaje del usuario */

    addMessage(text, "user");


    /* Limpiar campo */

    chatbotInput.value = "";


    /* Respuesta del asistente */

    setTimeout(() => {

        const response =
            getBotResponse(text);

        addMessage(response, "bot");

    }, 500);
}


/* Botón enviar */

if (chatbotSend) {
    chatbotSend.addEventListener(
        "click",
        sendMessage
    );
}


/* =========================================
   ENTER PARA ENVIAR
========================================= */

if (chatbotInput) {

    chatbotInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                sendMessage();

            }

        }
    );

}


/* =========================================
   BOTONES DE OPCIONES
========================================= */

const chatbotOptions =
    document.querySelectorAll(
        ".chatbot-options button"
    );


chatbotOptions.forEach((button) => {

    button.addEventListener("click", () => {

        const question =
            button.getAttribute(
                "data-question"
            );


        /* Mostrar pregunta del usuario */

        addMessage(
            question,
            "user"
        );


        /* Responder */

        setTimeout(() => {

            const response =
                getBotResponse(question);

            addMessage(
                response,
                "bot"
            );

        }, 500);

    });

});
