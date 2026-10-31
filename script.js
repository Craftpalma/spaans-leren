/* =========================================
      REGISTRAR VISITA 
========================================= */

window.addEventListener("load", function() {
    fetch("/api/chat", { // <--- CAMBIO AQUÍ
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "record_visit" })
    })
       .then(res => res.json())
    .then(data => console.log("Visita registrada:", data))
    .catch(err => console.log("Error registrando visita:", err));
});
/* =========================================
   MENÚ MÓVIL DE NAVEGACIÓN
========================================= */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (menuButton && navMenu) {

    menuButton.addEventListener("click", function () {

        const isOpen = navMenu.classList.toggle("active");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Cerrar menú" : "Abrir menú"
        );

    });

    navMenu.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {
            navMenu.classList.remove("active");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Abrir menú");
        });

    });

}
/* =========================================
   MENÚ MÓVIL
========================================= */

const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

if (menuButton && navMenu) {
    menuButton.addEventListener("click", (e) => {
        e.preventDefault(); // <--- AÑADE ESTA LÍNEA
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
   AÑADIR MENSAJE AL CHAT (CON BOTONES)
========================================= */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.classList.add(
        type === "user"
            ? "user-message"
            : "bot-message"
    );

    // 1. Limpiar los saltos de línea extraños de la IA
    let cleanText = text.replace(/(\r\n|\r|\n){3,}/g, '$1\n\n');

    // 2. Convertir el enlace del test en un botón
    let formattedText = cleanText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, linkText, url) {
        
        if (url.includes("test.html")) {
            // Botón grande para el test
            return `<a href="${url}" class="chat-action-button">${linkText}</a>`;
        } else {
            // Enlace normal para otras URLs
            return `<a href="${url}" target="_blank" style="color: #176b87; text-decoration: underline; font-weight: bold;">${linkText}</a>`;
        }
    });
    
    // 3. Insertar el texto en el mensaje
    message.innerHTML = formattedText;

    chatbotMessages.appendChild(message);

    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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
        localStorage.getItem("spaansLerenLanguage") === "nl"
                 ? "Even geduld..."
                 : "Espera un momento...";
    chatbotMessages.appendChild(waitingMessage);

    chatbotMessages.scrollTop =
        chatbotMessages.scrollHeight;


    try {

        const response = await fetch(
           /* "https://spaans-leren-chatbot.newpalma.workers.dev/",*//*antiguo script*/
              "/api/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: text,
                    history: conversationHistory,
                   language: document.documentElement.lang || "nl"
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

        const currentLanguage =
            document.documentElement.lang || "nl";

        const question = button.getAttribute(
            currentLanguage === "nl"
                ? "data-question-nl"
                : "data-question"
        );

        if (!question) {
            console.error(
                "No se encontró la pregunta para el idioma:",
                currentLanguage
            );
            return;
        }

        chatbotInput.value = question;
        chatbotInput.focus();

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
                          "/api/chat",
                       /* "https://spaans-leren-chatbot.newpalma.workers.dev/",*//*antiguo..*/
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

                if (option.value === selectedCourse) {

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
            navCalendario: "Afspraak maken",
            navtest: "Niveau Test",
            navNew: "Nieuws",
               // NUEVAS LÍNEAS PARA NOTICIAS
            noticiasTitle: "Nieuws en Updates",
            noticiasIntro: "Blijf op de hoogte van lessen, evenementen en tips om Spaans te leren.",
    
            heroEyebrow: "LEER SPAANS",
            navContacto: "Contact",
            heroEyebrow: "LEER SPAANS",
            heroTitleFirst: "Vind de cursus",
            heroTitleSecond: "die bij je past",
            heroDescription: "Spaanse lessen afgestemd op jouw niveau, doelen en manier van leren.",
            heroButton: "Gratis proefles",
                       // Presentación profesora
            aboutEyebrow: "OVER MIJ",
            aboutTitle: "Hallo! Ik ben Gloria Heredia",
            aboutP1: "Ik ben docent basisonderwijs en heb 26 jaar ervaring in het onderwijs. Tijdens mijn loopbaan heb ik in Nederland gewerkt als docente Spaans in verschillende particuliere instellingen en in het bedrijfsleven. Momenteel werk ik bij een Spaanse school in Málaga en geef ik particuliere online lessen.",
            aboutP2: "Mijn doel is je Spaans te leren op een praktische, leuke manier die past bij jouw behoeften, interesses en leertempo.",
            aboutTitle2: "Online lessen aangepast aan jou",
            aboutP3: "De lessen duren 50 minuten en worden gegeven via Zoom, Skype of Google Meet. We werken aan de verschillende taalvaardigheden:",
            aboutList1: "Grammatica en woordenschat.",
            aboutList2: "Luister- en leesvaardigheid.",
            aboutList3: "Mondelinge en schriftelijke expressie.",
            aboutList4: "Cultuur, tradities en gewoonten van Spaanstalige landen.",
            aboutP4: "Je kunt bij mij Spaans leren in het Nederlands of Engels, afhankelijk van je voorkeuren en niveau.",
            aboutTitle3: "Welk Spaans wil je leren?",
            aboutP5: "Je kunt kiezen uit Spaans uit Spanje, Rioplatensisch Spaans of de verschillende varianten van Latijns-Amerikaans Spaans.",
            aboutP6: "Naast de taal leer je ook de culturele bijzonderheden van de landen die je het meest interesseren. Spaans leren is ook nieuwe manieren ontdekken om de wereld te zien!",
            aboutTitle4: "Een gepersonaliseerde leermethode",
            aboutP7: "Elke leerling heeft zijn eigen doelen. Daarom pas ik de lessen aan op jouw niveau, behoeften en persoonlijke of professionele doelen.",
            aboutP8: "Voor Nederlandse leerlingen gebruik ik het boek Con gusto, aangevuld met ander lesmateriaal. Ik stuur je ook oefeningen en oefenmateriaal per e-mail, die ik indien nodig corrigeer om je tussen de lessen door te helpen vooruitgang te boeken.",
            aboutP9: "Voor goede resultaten raad ik aan om naast de lestijd minstens twee uur per week te besteden aan het studeren en oefenen van Spaans.",
            aboutTitle5: "Begin met een gratis proefles",
            aboutP10: "Wil je Spaans leren, je conversatie verbeteren of vertrouwen krijgen in het spreken?",
            aboutP11: "Voordat we beginnen, kunnen we een gratis proefles van 30 minuten afspreken. Tijdens deze sessie bespreken we je doelen, beoordelen we je Spaanse niveau en leg ik uit hoe we je leerproces kunnen organiseren en welk materiaal we gebruiken.",
            aboutButton: "Boek je gratis proefles!",
           
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


            specificDescription: "Op maat gemaakt voor specifieke behoeften. Of je nu een officieel examen wilt voorbereiden of Spaans wilt leren voor jouw sector, dit is jouw cursus.",
            specificItem1: "Voorbereiding op examens (DELE, SIELE).",
            specificItem2: "Spaans voor professionals (gezondheidszorg, horeca, etc.).",
            specificItem3: "Specifieke culturele en conversatieworkshops.",
            specificObjective: "Het beheersen van de woordenschat en structuren van jouw interessegebied.",  

            businessLabel: "ZAKELIJK",
            businessQuote: "“Effectieve professionele communicatie”",
            businessDescription: "Gericht op zakelijke en professionele situaties.",
            businessItem1: "Vergaderingen",
            businessItem2: "Formele e-mails",
            businessItem3: "Presentaties",
            businessItem4: "Onderhandelen",
            businessItem5: "Zakelijke woordenschat",
            businessObjective: "Met vertrouwen in het Spaans werken.",


            calendarTitle: "Afspraak maken",
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
           
            formName: "Naam",
            formNamePlaceholder: "Je naam",
            formEmail: "E-mailadres",
            formEmailPlaceholder: "jouw@email.com",
            formCourse: "Welke cursus interesseert je?",
            formSelectOption: "Kies een optie",
            formCourseA1: "A1 - Beginners",
            formCourseA2: "A2",
            formCourseB1: "B1 - Gemiddeld niveau",
            formCourseB2: "B2 - Gevorderd niveau",
            formCourseConversation: "Gesprekken in het Spaans",
            formCourseSpecific: "Cursussen voor specifieke doelen",
            formCourseBusiness: "Zakelijk Spaans",
            formCourseTrial: "Gratis proefles",
            formMessage: "Bericht",
            formMessagePlaceholder: "Vertel ons wat je nodig hebt...",
            formSubmit: "Verstuur bericht",
            formNote: "* Laat ons je bericht achter. We nemen zo snel mogelijk contact met je op.",

            chatTitle: "Spaans Leren-assistent",
            chatOnline: "● Online",
            chatGreeting: "👋 Hallo! Ik ben de assistent van Spaans Leren.",
            chatHelp: "Waarmee kan ik je helpen?",
            chatCourses: "📚 Informatie over cursussen",
            chatPrices: "💰 Prijzen",
            chatTrial: "🎓 Gratis proefles",
            chatReserve: "📅 Ik wil een les reserveren",
            chatPlaceholder: "Typ je vraag...",
           chatSuggestions: "Je kunt ook vragen naar:",


        },

        es: {
            navInicio: "Inicio",
            navCursos: "Cursos",
            navPrecios: "Precios",
            navCalendario: "Calendario",
            navtest: "Test de Nivel",
            navNew: "Noticias",
            noticiasTitle: "Noticias y Novedades",
            noticiasIntro: "Mantente al día sobre clases, eventos y consejos para aprender español.",
            heroEyebrow: "APRENDE ESPAÑOL",
            navContacto: "Contacto",
            heroEyebrow: "APRENDE ESPAÑOL",
            heroTitleFirst: "Encuentra el curso",
            heroTitleSecond: "perfecto para ti",
            heroDescription: "Cursos de español adaptados a tu nivel, tus objetivos y tu forma de aprender.",
            heroButton: "Clase de prueba gratis",
                       // Presentación profesora
            aboutEyebrow: "SOBRE MÍ",
            aboutTitle: "¡Hola! Soy Gloria Heredia",
            aboutP1: "Soy docente de educación primaria y cuento con 26 años de experiencia en la enseñanza. Durante mi trayectoria profesional he trabajado en Países Bajos como profesora de español en diferentes centros privados y en el ámbito empresarial. Actualmente, trabajo en una escuela de español en Málaga y doy clases particulares online.",
            aboutP2: "Mi objetivo es ayudarte a aprender español de una manera práctica, amena y adaptada a tus necesidades, tus intereses y tu ritmo de aprendizaje.",
            aboutTitle2: "Clases online adaptadas a ti",
            aboutP3: "Las clases duran 50 minutos y se imparten a través de Zoom, Skype o Google Meet. Trabajaremos las diferentes destrezas del idioma:",
            aboutList1: "Gramática y vocabulario.",
            aboutList2: "Comprensión auditiva y lectora.",
            aboutList3: "Expresión oral y escrita.",
            aboutList4: "Cultura, tradiciones y costumbres de los países hispanohablantes.",
            aboutP4: "Podrás aprender español conmigo en neerlandés o en inglés, según tus preferencias y tu nivel.",
            aboutTitle3: "¿Qué español quieres aprender?",
            aboutP5: "Puedes elegir entre el español de España, el español rioplatense o las distintas variedades del español de Latinoamérica.",
            aboutP6: "Además de aprender el idioma, descubrirás las particularidades culturales de los países que más te interesen. ¡Aprender español también es descubrir nuevas formas de ver el mundo!",
            aboutTitle4: "Un método de aprendizaje personalizado",
            aboutP7: "Cada alumno tiene sus propios objetivos. Por eso, adapto las clases a tu nivel, tus necesidades y tus metas personales o profesionales.",
            aboutP8: "Para los alumnos neerlandeses utilizo el libro Con gusto, complementado con otros materiales didácticos. También te enviaré ejercicios y material de práctica por correo electrónico, que corregiré cuando sea necesario para ayudarte a progresar entre clases.",
            aboutP9: "Para obtener buenos resultados, recomiendo dedicar al menos dos horas semanales al estudio y la práctica del español, además del tiempo de clase.",
            aboutTitle5: "Empieza con una clase de prueba gratuita",
            aboutP10: "¿Quieres aprender español, mejorar tu conversación o ganar confianza al hablar?",
            aboutP11: "Antes de comenzar las clases, podemos concertar una clase de prueba gratuita de 30 minutos. Durante esta sesión hablaremos sobre tus objetivos, valoraremos tu nivel de español y te explicaré cómo podemos organizar tu aprendizaje y qué materiales utilizaremos.",
            aboutButton: "¡Reserva tu clase de prueba gratuita!",
           
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


    
   
            conversationQuote: "“Hablar, practicar y ganar confianza”",
            conversationDescription: "Clases centradas exclusivamente en la producción oral.",
            conversationItem1: "Estudiantes que entienden español",
            conversationItem2: "Personas que necesitan soltarse",
            conversationItem3: "Práctica de conversación",
            conversationItem4: "Mejorar pronunciación",
            conversationTopics: "Actualidad, cultura, viajes, experiencias personales y debates.",

            specificDescription: "Diseñados a medida para necesidades concretas. Si buscas preparar un examen oficial o aprender el español de tu sector, este es tu curso.",
            specificItem1: "Preparación de exámenes (DELE, SIELE).",
            specificItem2: "Español para profesionales (sanidad, hostelería, etc.).",
            specificItem3: "Talleres culturales y de conversación específicos.",
            specificObjective: "Dominar el vocabulario y las estructuras de tu área de interés.",

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
           
            formName: "Nombre",
            formNamePlaceholder: "Tu nombre",
            formEmail: "Email",
            formEmailPlaceholder: "tu@email.com",
            formCourse: "Curso que te interesa",
            formSelectOption: "Selecciona una opción",
            formCourseA1: "A1 - Principiantes",
            formCourseA2: "A2",
            formCourseB1: "B1 - Nivel intermedio",
            formCourseB2: "B2 - Nivel avanzado",
            formCourseConversation: "Conversación en español",
            formCourseSpecific: "Cursos para fines específicos",
            formCourseBusiness: "Español para negocios",
            formCourseTrial: "Clase de prueba gratuita",
            formMessage: "Mensaje",
            formMessagePlaceholder: "Cuéntanos qué necesitas...",
            formSubmit: "Enviar consulta",
            formNote: "* Déjanos tu mensaje y nos pondremos en contacto contigo lo antes posible.",

            chatTitle: "Asistente Spaans Leren",
            chatOnline: "● En línea",
            chatGreeting: "👋 ¡Hola! Soy el asistente de Spaans Leren.",
            chatHelp: "¿En qué puedo ayudarte?",
            chatCourses: "📚 Información sobre cursos",
            chatPrices: "💰 Precios",
            chatTrial: "🎓 Clase de prueba gratis",
            chatReserve: "📅 Quiero reservar",
            chatPlaceholder: "Escribe tu pregunta...",
           chatSuggestions: "También puedes consultar:",














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
           
            document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
                const key = element.dataset.i18nPlaceholder;
                const translatedText = translations[language][key];
            
                if (translatedText !== undefined) {
                    element.placeholder = translatedText;
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

/* =========================================
   ABRIR CHATBOT AUTOMÁTICAMENTE (30 SEG)
========================================= */
window.addEventListener("load", function() {
    setTimeout(function() {
        // Usamos los IDs que ya tienes definidos en tu HTML
        const chatWindow = document.getElementById("chatbotWindow");
        const chatButton = document.getElementById("chatbotButton");
        
        // Si existen y la ventana está cerrada, la abrimos
        if (chatWindow && chatButton) {
            if (!chatWindow.classList.contains("active")) {
                chatButton.click();
                console.log("Chatbot abierto automáticamente.");
            }
     /*   } else {
            console.error("No se encontró el botón o la ventana del chat.");*/
        }
    }, 30000); // 30 segundos
});
/* =========================================
   CONTROLADOR DE LA CABECERA DEL CHAT
   (Modo Normal, Modo Cristal y Cerrar)
========================================= */

// 1. BOTÓN NORMAL (🔄): Reinicia el chat y quita el efecto cristal
const chatbotNormal = document.getElementById("chatbotNormal");

if (chatbotNormal) {
    chatbotNormal.addEventListener("click", () => {
        // A) Borrar SOLO los mensajes, manteniendo los botones de opciones
        const messages = chatbotMessages.querySelectorAll('.bot-message, .user-message');
        messages.forEach(msg => msg.remove());
        
        // B) Volver a poner el saludo inicial arriba del todo
        const currentLang = document.documentElement.lang || "nl";
        const greeting = currentLang === "nl" 
            ? "👋 Hallo! Ik ben de assistent van Spaans Leren.<br>Waarmee kan ik je helpen?"
            : "👋 ¡Hola! Soy el asistente de Spaans Leren.<br>¿En qué puedo ayudarte?";
            
        const greetingDiv = document.createElement("div");
        greetingDiv.classList.add("bot-message");
        greetingDiv.innerHTML = greeting;
        chatbotMessages.prepend(greetingDiv); // prepend lo pone al principio

        // C) Quitar el modo cristal (volver al fondo blanco)
        chatbotWindow.classList.remove("glass-active");
    });
}

// 2. BOTÓN CRISTAL (👁️): Activa el modo transparente
const chatbotGlass = document.getElementById("chatbotGlass");

if (chatbotGlass) {
    chatbotGlass.addEventListener("click", () => {
        chatbotWindow.classList.add("glass-active");
    });
}
/* =========================================
   CONTROLES DEL CHAT (Cristal, Normal y Arrastre)
========================================= */

// 1. BOTÓN CRISTAL (👁️)
const btnGlass = document.getElementById("chatbotGlass");
if (btnGlass) {
    btnGlass.addEventListener("click", () => {
        chatbotWindow.classList.add("glass-active");
    });
}

// 2. BOTÓN NORMAL / REINICIAR (🔄)
const btnNormal = document.getElementById("chatbotNormal");
if (btnNormal) {
    btnNormal.addEventListener("click", () => {
        // Quitar cristal
        chatbotWindow.classList.remove("glass-active");

        // Reiniciar mensajes (manteniendo los botones de abajo)
        const messages = chatbotWindow.querySelectorAll('.bot-message, .user-message');
        messages.forEach(msg => msg.remove());
        
        const currentLang = document.documentElement.lang || "nl";
        const greeting = currentLang === "nl" 
            ? "👋 Hallo! Ik ben de assistent van Spaans Leren.<br>Waarmee kan ik je helpen?"
            : "👋 ¡Hola! Soy el asistente de Spaans Leren.<br>¿En qué puedo ayudarte?";
            
        const greetingDiv = document.createElement("div");
        greetingDiv.classList.add("bot-message");
        greetingDiv.innerHTML = greeting;
        chatbotMessages.prepend(greetingDiv);
    });
}

// 3. HACER EL CHAT ARRASTRABLE (Usando transform)
const dragHeader = document.querySelector(".chatbot-header");
let isDragging = false;
let startX, startY;
let translateX = 0;
let translateY = 0;

if (dragHeader) {
    dragHeader.addEventListener("pointerdown", (e) => {
        // Si hace clic en un botón (X, ojo, etc.), no arrastramos
        if (e.target.closest("button")) return;

        isDragging = true;
        dragHeader.style.cursor = "grabbing";
        
        // Calculamos la posición inicial restando lo que ya se ha movido
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    window.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Evita seleccionar texto al arrastrar

        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        
        // Movemos usando transform (mucho más fluido)
        chatbotWindow.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });

    window.addEventListener("pointerup", () => {
        isDragging = false;
        dragHeader.style.cursor = "grab";
    });
}
