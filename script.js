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


    /* =========================================
       IDENTIFICAR ESTA PETICIÓN
    ========================================= */

    const requestId = ++sendMessage.lastRequestId;


    /* =========================================
       CANCELAR PETICIÓN ANTERIOR
    ========================================= */

    if (currentController) {
        currentController.abort();
    }

    currentController = new AbortController();

    const signal = currentController.signal;


    /* =========================================
       MOSTRAR MENSAJE DEL USUARIO
    ========================================= */

    addMessage(text, "user");

    chatbotInput.value = "";


    /* =========================================
       MENSAJE TEMPORAL
    ========================================= */

    const waitingMessage =
        document.createElement("div");

    waitingMessage.classList.add("bot-message");

    waitingMessage.textContent =
        "Espera un momento...";

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
           COMPROBAR SI SIGUE SIENDO LA PETICIÓN
           MÁS RECIENTE
        ========================================= */

        if (requestId !== sendMessage.lastRequestId) {

            console.log(
                "Respuesta ignorada por ser de una petición anterior:",
                text
            );

            return;
        }


        /* =========================================
           ELIMINAR "ESPERA..."
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
           PETICIÓN CANCELADA
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
           SI YA HAY UNA PETICIÓN MÁS NUEVA
        ========================================= */

        if (requestId !== sendMessage.lastRequestId) {

            console.log(
                "Error ignorado porque existe una petición más reciente."
            );

            return;
        }


        /* =========================================
           ELIMINAR SU PROPIO "ESPERA..."
        ========================================= */

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
/* =========================================
   IDIOMAS - SPAANS LEREN
   Neerlandés predeterminado + español
========================================= */

(function () {
    const translations = {
        nl: {
            navInicio: "Home",
            navCursos: "Cursussen",
            navPrecios: "Prijzen",
            navCalendario: "Kalender",
            navContacto: "Contact",
            heroEyebrow: "LEER SPAANS",
            heroTitleFirst: "Vind de cursus",
            heroTitleSecond: "die bij je past",
            heroDescription:
                "Spaanse lessen afgestemd op jouw niveau, doelen en manier van leren.",
            heroButton: "Gratis proefles",
           
            coursesEyebrow: "ONZE CURSUSSEN",
            coursesTitle: "Leer in je eigen tempo",
            coursesDescription: "Van je eerste Spaanse woorden tot gevorderde gesprekken en professionele communicatie.",
            courseBeginner: "Beginners",
            courseBasic: "Basisniveau",
            courseIntermediate: "Gemiddeld niveau",
            courseAdvanced: "Gevorderd niveau",
            courseIncludes: "Inbegrepen:",
            courseObjective: "Doel:",
            courseInterested: "Ik heb interesse",
            coursePopular: "MEEST GEKOZEN",
            courseConversation: "Gesprekken in het Spaans",
            courseSpecial: "SPECIAAL",
            courseSpecific: "Cursussen voor specifieke doelen",
            courseBusiness: "Zakelijk Spaans",
            courseTalk: "SPREKEN",
            courseIdealFor: "Ideaal voor:",
            courseTopics: "Onderwerpen:",
                       
            a1Description: "Begin je net met Spaans? Deze cursus geeft je een stevige basis om in alledaagse situaties te communiceren.",
            a1Item1: "Begroetingen en kennismaking",
            a1Item2: "Getallen, datums en tijden",
            a1Item3: "Basiswerkwoorden in de tegenwoordige tijd",
            a1Item4: "Eenvoudige beschrijvingen",
            a1Item5: "Dagelijkse gesprekken",
            a1Objective: "Communiceren in eenvoudige alledaagse situaties.",
      
            a2Description: "Heb je al enige kennis van het Spaans? Deze cursus helpt je je spreekvaardigheid, grammatica en woordenschat te verbeteren.",
            a2Item1: "Verleden tijd en nabije toekomst",
            a2Item2: "Dagelijkse routines en persoonlijke ervaringen",
            a2Item3: "Winkelen, reizen en vrije tijd",
            a2Item4: "Basis luistervaardigheid",
            a2Item5: "Begeleide gesprekken",
            a2Objective: "Eenvoudige gesprekken met vertrouwen voeren.",

   
            b2Description: "Verbeter je Spaans zodat je het vloeiend kunt gebruiken in sociale, academische en professionele situaties.",
            b2Item1: "De aanvoegende wijs en complexe zinsconstructies",
            b2Item2: "Debatteren en argumenteren",
            b2Item3: "Idiomatische uitdrukkingen",
            b2Item4: "Gevorderde schrijfvaardigheid",
            b2Item5: "Uitspraak en natuurlijk taalgebruik",
            b2Objective: "Vloeiend en nauwkeurig communiceren.",
   
            b1Description: "Voor iedereen die zijn spreek- en schrijfvaardigheid wil verbeteren en zelfstandiger Spaans wil gebruiken.",
            b1Item1: "De belangrijkste werkwoordstijden",
            b1Item2: "Ervaringen vertellen",
            b1Item3: "Meningen en argumenten",
            b1Item4: "Authentieke teksten en audiofragmenten",
            b1Item5: "Spontane gesprekken",
            b1Objective: "Zelfstandig kunnen communiceren in de meeste situaties.",

           
            conversationQuote: "“Praten, oefenen en zelfvertrouwen opbouwen”",
            conversationDescription: "Lessen die volledig gericht zijn op spreekvaardigheid.",
            conversationItem1: "Studenten die Spaans begrijpen",
            conversationItem2: "Mensen die gemakkelijker willen leren spreken",
            conversationItem3: "Gespreksoefeningen",
            conversationItem4: "De uitspraak verbeteren",
            conversationTopics: "Actualiteit, cultuur, reizen, persoonlijke ervaringen en debatten.",


            conversationQuote: "“Praten, oefenen en zelfvertrouwen opbouwen”",
            conversationDescription: "Lessen die volledig gericht zijn op spreekvaardigheid.",
            conversationItem1: "Studenten die Spaans begrijpen",
            conversationItem2: "Mensen die gemakkelijker willen leren spreken",
            conversationItem3: "Gespreksoefeningen",
            conversationItem4: "De uitspraak verbeteren",
            conversationTopics: "Actualiteit, cultuur, reizen, persoonlijke ervaringen en debatten.",

            businessLabel: "ZAKELIJK",
            businessQuote: "“Effectieve professionele communicatie”",
            businessDescription: "Gericht op zakelijke en professionele situaties.",
            businessItem1: "Vergaderingen",
            businessItem2: "Formele e-mails",
            businessItem3: "Presentaties",
            businessItem4: "Onderhandelen",
            businessItem5: "Zakelijke woordenschat",
            businessObjective: "Met vertrouwen in het Spaans werken.",


            calendarTitle: "KALENDER",
            weekdayMon: "Ma",
            weekdayTue: "Di",
            weekdayWed: "Wo",
            weekdayThu: "Do",
            weekdayFri: "Vr",
            weekdaySat: "Za",
            weekdaySun: "Zo",
            calendarSubtitle: "Bekijk je lesmogelijkheden",
            calendarDescription: "Bekijk de beschikbare dagen en tijden voor je Spaanse lessen.",

         
            trialEyebrow: "WEET JE NIET WELK NIVEAU JE HEBT?",
            trialTitle: "Begin met een proefles",
            trialDescription: "Een eerste gratis sessie van 30 minuten om je niveau te bepalen en je doelen vast te stellen.",
            trialButton: "Gratis proefles boeken",

            contactEyebrow: "CONTACT",
            contactTitle: "Klaar om te beginnen?",
            contactDescription: "Vertel ons wat je nodig hebt en we helpen je de juiste cursus te vinden.",
           
            pricingEyebrow: "PRIJZEN",
            pricingTitle: "Begin vrijblijvend",
            pricingDescription: "Probeer een les en kies daarna het lespakket dat het beste bij je past.",
            priceTrial: "PROEFLES",
            priceFree: "Gratis",
            priceDuration: "30 minuten",
            priceDiagnosis: "Eerste niveaubepaling",
            priceReserve: "Reserveren",
            pricePack5: "PAKKET 5",
            priceFiveClasses: "5 lessen",
            priceIndividual: "Individuele lessen",
            pricePack10: "PAKKET 10",
            priceTenClasses: "10 lessen",













        },

        es: {
            navInicio: "Inicio",
            navCursos: "Cursos",
            navPrecios: "Precios",
            navCalendario: "Calendario",
            navContacto: "Contacto",
            heroEyebrow: "APRENDE ESPAÑOL",
            heroTitleFirst: "Encuentra el curso",
            heroTitleSecond: "perfecto para ti",
            heroDescription:
                "Cursos de español adaptados a tu nivel, tus objetivos y tu forma de aprender.",
            heroButton: "Clase de prueba gratis",
           
            coursesEyebrow: "NUESTROS CURSOS",
            coursesTitle: "Aprende a tu ritmo",
            coursesDescription: "Desde tus primeras palabras en español hasta conversaciones avanzadas y comunicación profesional.",
            courseBeginner: "Principiantes",
            courseBasic: "Nivel básico",
            courseIntermediate: "Nivel intermedio",
            courseAdvanced: "Nivel avanzado",
            courseIncludes: "Incluye:",
            courseObjective: "Objetivo:",
            courseInterested: "Me interesa",
            coursePopular: "MÁS ELEGIDO",
            courseConversation: "Conversación en español",
            courseSpecial: "ESPECIAL",
            courseSpecific: "Cursos para fines específicos",
            courseBusiness: "Español para negocios",
            courseTalk: "HABLA",
            courseIdealFor: "Ideal para:",
            courseTopics: "Temas:",
            
            a1Description: "¿Acabas de empezar con el español? Este curso te dará una base sólida para comunicarte en situaciones cotidianas.",
            a1Item1: "Saludos y presentaciones",
            a1Item2: "Números, fechas y horarios",
            a1Item3: "Verbos básicos en presente",
            a1Item4: "Descripciones simples",
            a1Item5: "Conversaciones cotidianas",
            a1Objective: "Comunicarte en situaciones básicas del día a día.",

            a2Description: "Si ya tienes algunas nociones de español, este curso te ayudará a mejorar tu fluidez, gramática y vocabulario.",
            a2Item1: "Pasado y futuro próximo",
            a2Item2: "Rutinas y experiencias personales",
            a2Item3: "Compras, viajes y ocio",
            a2Item4: "Comprensión oral básica",
            a2Item5: "Conversaciones guiadas",
            a2Objective: "Mantener conversaciones sencillas con confianza.",

           
            b2Description: "Perfecciona tu español para utilizarlo con soltura en contextos sociales, académicos y laborales.",
            b2Item1: "Subjuntivo y estructuras complejas",
            b2Item2: "Debate y argumentación",
            b2Item3: "Expresiones idiomáticas",
            b2Item4: "Producción escrita avanzada",
            b2Item5: "Pronunciación y naturalidad",
            b2Objective: "Comunicarte con soltura y precisión.",

            b1Description: "Para quienes quieren mejorar su expresión oral y escrita y desenvolverse con mayor autonomía en español.",
            b1Item1: "Tiempos verbales principales",
            b1Item2: "Narración de experiencias",
            b1Item3: "Opiniones y argumentos",
            b1Item4: "Textos y audios reales",
            b1Item5: "Conversación espontánea",
            b1Objective: "Desenvolverte con autonomía en la mayoría de situaciones.",
           
            conversationQuote: "“Praten, oefenen en zelfvertrouwen opbouwen”",
            conversationDescription: "Lessen die volledig gericht zijn op spreekvaardigheid.",
            conversationItem1: "Studenten die Spaans begrijpen",
            conversationItem2: "Mensen die gemakkelijker willen leren spreken",
            conversationItem3: "Gespreksoefeningen",
            conversationItem4: "De uitspraak verbeteren",
            conversationTopics: "Actualiteit, cultuur, reizen, persoonlijke ervaringen en debatten.",
   
            conversationQuote: "“Hablar, practicar y ganar confianza”",
            conversationDescription: "Clases centradas exclusivamente en la producción oral.",
            conversationItem1: "Estudiantes que entienden español",
            conversationItem2: "Personas que necesitan soltarse",
            conversationItem3: "Práctica de conversación",
            conversationItem4: "Mejorar pronunciación",
            conversationTopics: "Actualidad, cultura, viajes, experiencias personales y debates.",

            businessLabel: "NEGOCIOS",
            businessQuote: "“Comunicación profesional efectiva”",
            businessDescription: "Enfocado en contextos empresariales y laborales.",
            businessItem1: "Reuniones",
            businessItem2: "Correos formales",
            businessItem3: "Presentaciones",
            businessItem4: "Negociación",
            businessItem5: "Vocabulario corporativo",
            businessObjective: "Trabajar en español con seguridad.",


            calendarTitle: "CALENDARIO",
            weekdayMon: "L",
            weekdayTue: "M",
            weekdayWed: "X",
            weekdayThu: "J",
            weekdayFri: "V",
            weekdaySat: "S",
            weekdaySun: "D",
            calendarSubtitle: "Consulta tu clase",
            calendarDescription: "Comprueba los días y horarios disponibles para tus clases de español.",

  
            trialEyebrow: "¿NO SABES QUÉ NIVEL TIENES?",
            trialTitle: "Empieza con una clase de prueba",
            trialDescription: "Una primera sesión gratuita de 30 minutos para conocer tu nivel y definir tus objetivos.",
            trialButton: "Reservar prueba gratuita",
            
            contactEyebrow: "CONTACTO",
            contactTitle: "¿Listo para empezar?",
            contactDescription: "Cuéntanos qué necesitas y te ayudaremos a encontrar el curso adecuado para ti.",
         
            pricingEyebrow: "PRECIOS",
            pricingTitle: "Empieza sin compromiso",
            pricingDescription: "Prueba una clase y después elige el bono que mejor se adapte a ti.",
            priceTrial: "PRUEBA",
            priceFree: "Gratis",
            priceDuration: "30 minutos",
            priceDiagnosis: "Diagnóstico inicial",
            priceReserve: "Reservar",
            pricePack5: "PACK 5",
            priceFiveClasses: "5 clases",
            priceIndividual: "Clases individuales",
            pricePack10: "PACK 10",
            priceTenClasses: "10 clases",













        }
    };

    function initLanguageSelector() {
        const button = document.getElementById("languageToggle");

        if (!button) return;

        let currentLanguage = "nl";

        try {
            const savedLanguage = localStorage.getItem("spaansLerenLanguage");

            if (savedLanguage === "nl" || savedLanguage === "es") {
                currentLanguage = savedLanguage;
            }
        } catch (error) {
            // Si el almacenamiento no está disponible,
            // se utiliza neerlandés por defecto.
        }

        function applyLanguage(language) {
            currentLanguage = language;

            document.documentElement.lang = language;

            document.querySelectorAll("[data-i18n]").forEach(function (element) {
                const key = element.dataset.i18n;
                const translatedText = translations[language][key];

                if (translatedText !== undefined) {
                    element.textContent = translatedText;
                }
            });

            button.setAttribute(
                "aria-label",
                language === "nl"
                    ? "Verander de taal naar Spaans"
                    : "Cambiar idioma a neerlandés"
            );

            try {
                localStorage.setItem("spaansLerenLanguage", language);
            } catch (error) {
                // La web seguirá funcionando sin guardar la elección.
            }
        }

        button.addEventListener("click", function () {
            applyLanguage(currentLanguage === "nl" ? "es" : "nl");
        });

        applyLanguage(currentLanguage);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLanguageSelector
        );
    } else {
        initLanguageSelector();
    }
})();



