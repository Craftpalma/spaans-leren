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

/* =========================================
   MEMORIA DE LA CONVERSACIÓN
========================================= */

let conversationHistory = [];

/* Petición actual al Worker */
let currentController = null;

async function sendMessage() {

    const text = chatbotInput.value.trim();

    if (text === "") {
        return;
    }

    /* Cancelar la petición anterior si todavía está pendiente */
    if (currentController) {
        currentController.abort();
    }

    /* Crear controlador para esta nueva petición */
    currentController = new AbortController();

    const signal = currentController.signal;


    /* =========================================
       IDENTIFICAR ESTA PETICIÓN
    ========================================= */

    const requestId = ++sendMessage.lastRequestId;

       /* =========================================
      CANCELAR PETICION ANTERIOR
    ========================================= */
   /* Cancelar la petición anterior si todavía está pendiente */

if (currentController) {

    currentController.abort();

}

/* Crear controlador para esta nueva petición */

currentController = new AbortController();
   


    /* Mostrar mensaje del usuario */
    addMessage(text, "user");


    /* Limpiar campo */
    chatbotInput.value = "";


    /* Crear mensaje temporal propio para esta petición */
    const waitingMessage = document.createElement("div");

    waitingMessage.classList.add("bot-message");

    waitingMessage.textContent = "Espera un momento...";

    chatbotMessages.appendChild(waitingMessage);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;


    try {

        const response = await fetch(
            "https://spaans-leren-chatbot.newpalma.workers.dev/",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: text,
                    history: conversationHistory
                }),
               signal: signal
            }
        );


        const data = await response.json();


        /* =========================================
           COMPROBAR SI ESTA PETICIÓN SIGUE SIENDO
           LA ÚLTIMA
        ========================================= */

        if (requestId !== sendMessage.lastRequestId) {

            /*
             * El usuario ya ha enviado otra pregunta.
             * Esta respuesta queda obsoleta.
             */

            console.log(
                "Respuesta ignorada por ser de una petición anterior:",
                text
            );

            return;
        }


        /* =========================================
           ELIMINAR SU PROPIO "ESPERA..."
        ========================================= */

        if (waitingMessage.parentNode) {
            waitingMessage.remove();
        }


        /* =========================================
           RESPUESTA DEL WORKER
        ========================================= */

        if (data.reply) {

            /* Guardar conversación */

            conversationHistory.push({

                role: "user",

                parts: [
                    {
                        text: text
                    }
                ]

            });


            conversationHistory.push({

                role: "model",

                parts: [
                    {
                        text: data.reply
                    }
                ]

            });


            addMessage(
                data.reply,
                "bot"
            );


        } else if (data.message) {

            addMessage(
                "El asistente no ha podido completar la consulta. Inténtalo de nuevo.",
                "bot"
            );


        } else {

            addMessage(
                "No he recibido una respuesta válida del asistente. Inténtalo de nuevo.",
                "bot"
            );

        }


    } catch (error) {
   /* =========================================
          PETICIÓN CANCELADA POR UNA NUEVA
    ========================================= */

    if (error.name === "AbortError") {

        console.log(
            "Petición cancelada porque el usuario envió una nueva pregunta."
        );

        return;
    }

        console.error(
            "Error conectando con el Worker:",
            error
        );


        /* =========================================
           SI YA HAY UNA PETICIÓN MÁS NUEVA,
           IGNORAMOS TAMBIÉN ESTE ERROR
        ========================================= */

        if (requestId !== sendMessage.lastRequestId) {

            console.log(
                "Error ignorado porque existe una petición más reciente."
            );

            return;
        }


        /* Eliminar su propio mensaje temporal */

        if (waitingMessage.parentNode) {
            waitingMessage.remove();
        }


        addMessage(
            "No he podido conectar con el asistente. Inténtalo de nuevo.",
            "bot"
        );

    }

}


/* Contador de peticiones del chatbot */

sendMessage.lastRequestId = 0;
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
   BOTÓN ENVIAR
========================================= */

if (chatbotSend) {

    chatbotSend.addEventListener(
        "click",
        sendMessage
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

        /* Enviar la pregunta al Worker */
        chatbotInput.value = question;

        sendMessage();

    });

});

/* =========================================
   ABRIR CHATBOT DESDE ENLACE EXTERNO
========================================= */

const urlParams = new URLSearchParams(
    window.location.search
);

if (
    urlParams.get("openChat") === "true" &&
    chatbotWindow
) {

    chatbotWindow.classList.add("active");

}



/* =========================================
   FORMULARIO DE CONTACTO → WORKER → RESEND
========================================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =====================================
               OBTENER DATOS DEL FORMULARIO
            ===================================== */

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const course =
                document.getElementById("course").value;

            const message =
                document.getElementById("message").value.trim();


            /* =====================================
               COMPROBAR DATOS
            ===================================== */

            if (!name || !email || !message) {

                alert(
                    "Por favor, completa tu nombre, email y mensaje."
                );

                return;
            }


            /* =====================================
               BOTÓN ENVIANDO
            ===================================== */

            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );

            const originalText =
                submitButton.textContent;

            submitButton.disabled = true;

            submitButton.textContent =
                "Enviando...";


            try {


                /* =====================================
                   ENVIAR AL WORKER
                ===================================== */

                const response =
                    await fetch(
                        "https://spaans-leren-chatbot.newpalma.workers.dev/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                action: "contact",

                                name: name,

                                email: email,

                                course: course,

                                message: message

                            })
                        }
                    );


                const data =
                    await response.json();


                /* =====================================
                   RESPUESTA DEL WORKER
                ===================================== */

                if (data.ok) {

                    alert(
                        "¡Mensaje enviado correctamente! 😊"
                    );

                    contactForm.reset();

                } else {

                    alert(
                        "No se pudo enviar el mensaje: " +
                        (
                            data.error ||
                            "Error desconocido."
                        )
                    );

                    console.error(
                        "Error del Worker:",
                        data.error
                    );
                }


            } catch (error) {


                /* =====================================
                   ERROR DE CONEXIÓN
                ===================================== */

                console.error(
                    "Error enviando formulario:",
                    error
                );

                alert(
                    "No se pudo enviar el mensaje. " +
                    "Inténtalo de nuevo."
                );


            } finally {


                /* =====================================
                   RESTAURAR BOTÓN
                ===================================== */

                submitButton.disabled = false;

                submitButton.textContent =
                    originalText;

            }

        }
    );

}

/* =========================================
   BOTONES "ME INTERESA" → CONTACTO
========================================= */

const interestButtons = document.querySelectorAll(
    ".course-button, .price-interest"
);

interestButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const selectedCourse =
            button.getAttribute("data-course");

        const courseSelect =
            document.getElementById("course");

        const messageField =
            document.getElementById("message");


        /* =====================================
           SELECCIONAR CURSO AUTOMÁTICAMENTE
        ===================================== */

        if (courseSelect && selectedCourse) {

            let found = false;

            for (let option of courseSelect.options) {

                if (option.text === selectedCourse) {

                    courseSelect.value = selectedCourse;

                    found = true;

                    break;
                }
            }

            /* Si el curso no existe en el desplegable */
            if (!found) {
                courseSelect.value = "";
            }

        }


        /* =====================================
           MENSAJE AUTOMÁTICO
        ===================================== */

        if (messageField && selectedCourse) {

            messageField.value =
                "Estoy interesado/a en " +
                selectedCourse +
                ".";

        }


        /* =====================================
           BAJAR A CONTACTO
        ===================================== */

        const contactSection =
            document.getElementById("contacto");

        if (contactSection) {

            contactSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});



