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
     const startingDay = (new Date(year, month, 1).getDay() + 6) % 7;
    // Convertimos domingo = 0 a lunes = 0
   /* if (startingDay === 0) {
        startingDay = 6;
    } else {
        startingDay = startingDay - 1;
    }*/
   
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


    availableTimes.innerHTML = `

        <h3>${dayName}</h3>

        <p>Horarios disponibles:</p>

        <div class="time-list">

            <button>09:00</button>
            <button>10:00</button>
            <button>11:00</button>
            <button>12:00</button>
            <button>13:00</button>
            <button>14:00</button>
            <button>15:00</button>
            <button>16:00</button>
            <button>17:00</button>
            <button>18:00</button>
            <button>19:00</button>

        </div>

    `;
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
