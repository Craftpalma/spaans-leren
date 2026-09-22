/* =========================================
   SPAANS LEREN - CALENDARIO
========================================= */

// Fecha actual
let currentDate = new Date();


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

function renderCalendar() {

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
   
    const daysInMonth = new Date(year, month + 1, 0).getDate();


    // Espacios antes del primer día
    for (let i = 0; i < startingDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.classList.add("calendar-day", "empty");

        calendarDays.appendChild(emptyDay);
    }


    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {

        const date = new Date(year, month, day);

        const dayElement = document.createElement("button");

        dayElement.type = "button";

        dayElement.classList.add("calendar-day");

        dayElement.textContent = day;


        // Fin de semana
        if (date.getDay() === 0 || date.getDay() === 6) {

            dayElement.classList.add("weekend");

        } else {

            dayElement.addEventListener("click", function () {

                selectDay(year, month, day);

            });

        }


        calendarDays.appendChild(dayElement);
    }
}


// =========================================
// SELECCIONAR DÍA
// =========================================

function selectDay(year, month, day) {

    const selectedDate = new Date(year, month, day);

    const dayName = selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    const times = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00"
    ];


    availableTimes.innerHTML = `

        <h3>${dayName}</h3>

        <p>Selecciona un horario:</p>

        <div class="time-list"></div>

    `;


    const timeList = availableTimes.querySelector(".time-list");


    times.forEach(function(time) {

        const button = document.createElement("button");

        button.type = "button";

        button.textContent = time;

        button.classList.add("available-time");

        button.addEventListener("click", function() {

            selectTime(dayName, time);

        });

        timeList.appendChild(button);

    });

}
// =========================================
// SELECCIONAR HORA
// =========================================
function selectTime(dayName, time) {

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
                    Email o teléfono / WhatsApp
                </label>

                <input
                    type="text"
                    id="studentContact"
                    placeholder="Tu email o teléfono"
                    required
                >

                <button type="button" id="requestClass">
                    🟡 Solicitar esta hora
                </button>

            </div>

        </div>

    `;


    const requestClass = document.getElementById("requestClass");


    requestClass.addEventListener("click", function() {

        const studentName =
            document.getElementById("studentName").value.trim();

        const studentContact =
            document.getElementById("studentContact").value.trim();


        if (!studentName || !studentContact) {

            alert(
                "Por favor, introduce tu nombre y un email o teléfono."
            );

            return;
        }


        requestClass.textContent = "🟡 Pre-reserva realizada";

        requestClass.disabled = true;


        alert(
            `Solicitud enviada:\n\n` +
            `${dayName} a las ${time}\n` +
            `Nombre: ${studentName}\n` +
            `Contacto: ${studentContact}\n\n` +
            `La profesora debe confirmar la reserva.`
        );

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
