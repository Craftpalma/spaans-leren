/* =========================================
   SPAANS LEREN - CALENDARIO
========================================= */

// Fecha actual
let currentDate = new Date();
// =========================================
// IDIOMAS DEL CALENDARIO
// =========================================

const calendarTranslations = {
    es: {
        navHome: "Inicio",
        navCourses: "Cursos",
        navPrices: "Precios",
        navCalendar: "Calendario",
        navContact: "Contacto",
        title: "Calendario de clases",
        intro: "Consulta nuestra disponibilidad para clases de español.",
        usualHours: "Horario habitual",
        hours: "Lunes a viernes · 09:00 - 20:00",
        available: "Disponible",
        preReserved: "Pre-reserva",
        booked: "Reservada",
        selectDay: "Selecciona un día",
        availableTimes: "Aquí aparecerán los horarios disponibles.",
        checking: "Comprobando disponibilidad...",
        unavailableError: "No se ha podido consultar la disponibilidad. Inténtalo de nuevo.",
        selected: "Has seleccionado:",
        timeAvailable: "Esta hora está disponible para solicitar una clase.",
        name: "Nombre",
        namePlaceholder: "Tu nombre",
        phone: "Teléfono / WhatsApp",
        phonePlaceholder: "Tu teléfono / WhatsApp",
        request: "🟡 Solicitar esta hora",
        required: "Por favor, introduce tu nombre y tu teléfono.",
        invalidPhone: "Por favor, introduce un número de teléfono válido.",
        checkingButton: "⏳ Comprobando disponibilidad...",
        preReservation: "🟡 Pre-reserva realizada",
        requestSent: "Solicitud enviada:",
        teacherConfirmation: "La profesora debe confirmar la reserva.",
        timeUnavailable: "Hora no disponible",
        conflict: "Lo sentimos, esta hora acaba de ser reservada por otra persona.",
        requestError: "No se ha podido realizar la solicitud. Por favor, inténtalo de nuevo.",
        assistantTitle: "🤖 ¿Necesitas cancelar o modificar una reserva?",
        assistantDescription: "Puedes gestionar tus reservas fácilmente a través de nuestro asistente virtual.",
        assistantLink: "Hablar con el asistente",
        weekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },
    nl: {
        navHome: "Home",
        navCourses: "Cursussen",
        navPrices: "Prijzen",
        navCalendar: "Kalender",
        navContact: "Contact",
        title: "Leskalender",
        intro: "Bekijk de beschikbaarheid voor Spaanse lessen.",
        usualHours: "Gebruikelijke lestijden",
        hours: "Maandag t/m vrijdag · 09:00 - 20:00",
        available: "Beschikbaar",
        preReserved: "Voorlopig gereserveerd",
        booked: "Gereserveerd",
        selectDay: "Selecteer een dag",
        availableTimes: "Hier verschijnen de beschikbare tijden.",
        checking: "Beschikbaarheid controleren...",
        unavailableError: "De beschikbaarheid kon niet worden gecontroleerd. Probeer het opnieuw.",
        selected: "Je hebt geselecteerd:",
        timeAvailable: "Dit tijdstip is beschikbaar om een les aan te vragen.",
        name: "Naam",
        namePlaceholder: "Je naam",
        phone: "Telefoon / WhatsApp",
        phonePlaceholder: "Je telefoonnummer / WhatsApp",
        request: "🟡 Dit tijdstip aanvragen",
        required: "Vul je naam en telefoonnummer in.",
        invalidPhone: "Vul een geldig telefoonnummer in.",
        checkingButton: "⏳ Beschikbaarheid controleren...",
        preReservation: "🟡 Voorlopige reservering aangevraagd",
        requestSent: "Aanvraag verzonden:",
        teacherConfirmation: "De docent moet de reservering nog bevestigen.",
        timeUnavailable: "Tijdstip niet beschikbaar",
        conflict: "Sorry, dit tijdstip is zojuist door iemand anders gereserveerd.",
        requestError: "De aanvraag kon niet worden verzonden. Probeer het opnieuw.",
        assistantTitle: "🤖 Wil je een reservering annuleren of wijzigen?",
        assistantDescription: "Je kunt je reserveringen eenvoudig beheren via onze virtuele assistent.",
        assistantLink: "Chat met de assistent",
        weekdays: ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"],
        months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"]
    }
};

let calendarLanguage = "nl";

try {
    const savedCalendarLanguage =
        localStorage.getItem("spaansLerenLanguage");

    if (savedCalendarLanguage === "nl" ||
        savedCalendarLanguage === "es") {
        calendarLanguage = savedCalendarLanguage;
    }
} catch (error) {}

function calendarText(key) {
    return calendarTranslations[calendarLanguage][key];
}

function applyCalendarLanguage() {
    document.documentElement.lang = calendarLanguage;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        const translation = calendarText(key);

        if (translation !== undefined &&
            typeof translation === "string") {
            element.textContent = translation;
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.dataset.i18nPlaceholder;
        const translation = calendarText(key);

        if (translation !== undefined) {
            element.placeholder = translation;
        }
    });

    const languageButton = document.getElementById("languageToggle");

    if (languageButton) {
        languageButton.setAttribute(
            "aria-label",
            calendarLanguage === "nl"
                ? "Cambiar idioma a español"
                : "Verander de taal naar Nederlands"
        );
    }
}

const calendarLanguageButton =
    document.getElementById("languageToggle");

if (calendarLanguageButton) {
    calendarLanguageButton.addEventListener("click", function () {
        calendarLanguage = calendarLanguage === "nl" ? "es" : "nl";

        try {
            localStorage.setItem(
                "spaansLerenLanguage",
                calendarLanguage
            );
        } catch (error) {}

        applyCalendarLanguage();
        renderCalendar();
    });
}

applyCalendarLanguage();

// =========================================
// ELEMENTOS DEL CALENDARIO
// =========================================

const currentMonth = document.getElementById("currentMonth");
const calendarDays = document.getElementById("calendarDays");
const availableTimes = document.getElementById("availableTimes");

const previousMonth = document.getElementById("previousMonth");
const nextMonth = document.getElementById("nextMonth");


// =========================================
// MESES
// =========================================

const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];


// =========================================
// MOSTRAR CALENDARIO
// =========================================

async function renderCalendar() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    currentMonth.textContent = `${months[month]} ${year}`;

    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1);

    let startingDay = firstDay.getDay();

    // Convertimos domingo = 0 a lunes = 0
    if (startingDay === 0) {
        startingDay = 6;
    } else {
        startingDay = startingDay - 1;
    }

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    // =====================================
    // ESPACIOS ANTES DEL PRIMER DÍA
    // =====================================

    for (let i = 0; i < startingDay; i++) {

        const emptyDay =
            document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty"
        );

        calendarDays.appendChild(emptyDay);
    }


    // =====================================
    // DÍAS DEL MES
    // =====================================

    for (let day = 1; day <= daysInMonth; day++) {

        const date =
            new Date(year, month, day);

        const dayElement =
            document.createElement("button");

        dayElement.type = "button";

        dayElement.classList.add(
            "calendar-day"
        );

        dayElement.textContent = day;


        // =================================
        // FIN DE SEMANA
        // =================================

        if (
            date.getDay() === 0 ||
            date.getDay() === 6
        ) {

            dayElement.classList.add(
                "weekend"
            );

        } else {

            // =============================
            // CLICK EN DÍA
            // =============================

            dayElement.addEventListener(
                "click",
                function () {

                    selectDay(
                        year,
                        month,
                        day
                    );

                }
            );


            // =============================
            // COMPROBAR RESERVAS DEL DÍA
            // =============================

            const dateString =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


            fetch(
                `https://spaans-leren-chatbot.newpalma.workers.dev/?day=true&date=${dateString}`
            )
            .then(response => response.json())
            .then(data => {

                if (
                    !data.ok ||
                    !data.availability
                ) {
                    return;
                }


// =========================
// COMPROBAR ESTADO DEL DÍA
// =========================

const totalSlots =
    data.availability.length;


const preReservedSlots =
    data.availability.filter(
        slot =>
            slot.status === "pre_reserved"
    ).length;


const bookedSlots =
    data.availability.filter(
        slot =>
            slot.status === "booked"
    ).length;


const availableSlots =
    data.availability.filter(
        slot =>
            slot.status === "available"
    ).length;


// =========================
// DÍA COMPLETAMENTE OCUPADO
// =========================

if (
    availableSlots === 0 &&
    totalSlots > 0
) {

    /*
       Todas las horas están ocupadas.

       Si todas son pre-reservas:
       🟡 amarillo

       Si todas son reservas:
       🔴 rojo

       Si hay mezcla:
       🔴 rojo porque el día
       está completamente ocupado.
    */

    if (
        preReservedSlots === totalSlots
    ) {

        dayElement.classList.add(
            "fully-pre-reserved"
        );

    } else {

        dayElement.classList.add(
            "fully-booked"
        );

    }

}

            })
            .catch(error => {

                console.error(
                    `Error consultando el día ${dateString}:`,
                    error
                );

            });

        }


        calendarDays.appendChild(
            dayElement
        );

    }

}
// =========================================
// SELECCIONAR DÍA
// =========================================

async function selectDay(year, month, day) {

    const selectedDate = new Date(year, month, day);

    const dayName = selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    // Fecha en formato YYYY-MM-DD
    const dateString =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    availableTimes.innerHTML = `

        <h3>${dayName}</h3>

        <p>Comprobando disponibilidad...</p>

        <div class="time-list"></div>

    `;

    const timeList =
        availableTimes.querySelector(".time-list");


    try {

        const response = await fetch(
            `https://spaans-leren-chatbot.newpalma.workers.dev/?day=true&date=${dateString}`
        );

        const data = await response.json();


        if (!data.ok) {

            throw new Error(
                data.error || "No se pudo consultar la disponibilidad."
            );

        }


        data.availability.forEach(function(slot) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.textContent = slot.time;


            // =====================================
            // DISPONIBLE
            // =====================================

            if (slot.status === "available") {

                button.classList.add("available-time");

                button.addEventListener("click", function() {

                    selectTime(
                        dayName,
                        slot.time,
                        button
                    );

                });

            }


            // =====================================
            // PRE-RESERVADO
            // =====================================

            else if (slot.status === "pre_reserved") {

                button.classList.add("pre-reserved");

                button.disabled = true;

            }


            // =====================================
            // RESERVADO
            // =====================================

            else if (slot.status === "booked") {

                button.classList.add("booked");

                button.disabled = true;

            }


            // =====================================
            // OTRO ESTADO
            // =====================================

            else {

                button.disabled = true;

            }


            timeList.appendChild(button);

        });


    } catch (error) {

        console.error(
            "Error consultando disponibilidad:",
            error
        );

        availableTimes.innerHTML = `

            <h3>${dayName}</h3>

            <p>
                No se ha podido consultar la disponibilidad.
                Inténtalo de nuevo.
            </p>

        `;

    }

}

// =========================================
// SELECCIONAR HORA
// =========================================
async function selectTime(dayName, time, timeButton) {

    availableTimes.innerHTML = `

        <h3>${dayName}</h3>

        <div class="selected-time">

            <p>Has seleccionado:</p>

            <strong>${time}</strong>

            <p>
                Esta hora está disponible para solicitar una clase.
            </p>

            <div class="reservation-form">

                <label for="studentName">
                    Nombre
                </label>

                <input
                    type="text"
                    id="studentName"
                    placeholder="Tu nombre"
                    required
                >
                  <label for="studentContact">
                      Teléfono / WhatsApp
                  </label>
                  
                  <input
                      type="tel"
                      id="studentContact"
                      placeholder="Tu teléfono / WhatsApp"
                      required
                  >
   
                <button type="button" id="requestClass">
                    🟡 Solicitar esta hora
                </button>

            </div>

        </div>

    `;


    const requestClass =
        document.getElementById("requestClass");


    requestClass.addEventListener("click", async function() {

        const studentName =
            document.getElementById("studentName")
                .value
                .trim();

        const studentContact =
            document.getElementById("studentContact")
                .value
                .trim();


        // =====================================
        // COMPROBAR CAMPOS
        // =====================================

        if (!studentName || !studentContact) {

            alert(
                "Por favor, introduce tu nombre y tu teléfono."
            );

            return;
        }

         
        // =====================================
        // COMPROBAR TELÉFONO
        // =====================================

        const phonePattern =
            /^\+?[0-9\s().-]{7,20}$/;

        if (!phonePattern.test(studentContact)) {

            alert(
                "Por favor, introduce un número de teléfono válido."
            );

            return;
        }

  

        // =====================================
        // OBTENER FECHA
        // =====================================

        const selectedDate =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                parseInt(
                    dayName.match(/\d+/)[0]
                )
            );

        const dateString =
            `${selectedDate.getFullYear()}-` +
            `${String(selectedDate.getMonth() + 1).padStart(2, "0")}-` +
            `${String(selectedDate.getDate()).padStart(2, "0")}`;


        // =====================================
        // DESACTIVAR BOTÓN DURANTE LA PETICIÓN
        // =====================================

        requestClass.disabled = true;

        requestClass.textContent =
            "⏳ Comprobando disponibilidad...";


        try {

            const response = await fetch(
                "https://spaans-leren-chatbot.newpalma.workers.dev/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        action: "create_reservation",
                        date: dateString,
                        time: time,
                        name: studentName,
                        contact: studentContact,
                        class_type: "diagnóstico",
                        source: "calendar"
                    })
                }
            );


            const data =
                await response.json();


            // =====================================
            // RESERVA CREADA
            // =====================================

            if (
                response.ok &&
                data.ok &&
                data.created
            ) {

                requestClass.textContent =
                    "🟡 Pre-reserva realizada";


                timeButton.classList.add(
                    "pre-reserved"
                );

                timeButton.disabled = true;


                alert(
                    `Solicitud enviada:\n\n` +
                    `${dayName} a las ${time}\n` +
                    `Nombre: ${studentName}\n` +
                    `Contacto: ${studentContact}\n\n` +
                    `La profesora debe confirmar la reserva.`
                );


                return;
            }


            // =====================================
            // HORA YA OCUPADA
            // =====================================

            if (
                response.status === 409 ||
                data.status === "pre_reserved" ||
                data.status === "booked"
            ) {

                requestClass.disabled = false;

                requestClass.textContent =
                    "Hora no disponible";


                alert(
                    "Lo sentimos, esta hora acaba de ser reservada por otra persona."
                );


                return;
            }


            // =====================================
            // OTRO ERROR
            // =====================================

            throw new Error(
                data.error ||
                "No se pudo realizar la reserva."
            );


        } catch (error) {

            console.error(
                "Error creando pre-reserva:",
                error
            );


            requestClass.disabled = false;

            requestClass.textContent =
                "🟡 Solicitar esta hora";


            alert(
                "No se ha podido realizar la solicitud. " +
                "Por favor, inténtalo de nuevo."
            );
        }

    });

}

// =========================================
// CAMBIAR DE MES
// =========================================

previousMonth.addEventListener("click", function () {

    currentDate.setMonth(currentDate.getMonth() - 1);

    renderCalendar();

});


nextMonth.addEventListener("click", function () {

    currentDate.setMonth(currentDate.getMonth() + 1);

    renderCalendar();

});


// =========================================
// AÑO DEL FOOTER
// =========================================

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


// =========================================
// INICIAR CALENDARIO
// =========================================

renderCalendar();
