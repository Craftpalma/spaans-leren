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
                "Por favor, introduce tu nombre y un email o teléfono."
            );

            return;
        }


        // =====================================
        // COMPROBAR EMAIL / TELÉFONO
        // =====================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phonePattern =
            /^\+?[0-9\s().-]{7,20}$/;


        if (
            !emailPattern.test(studentContact) &&
            !phonePattern.test(studentContact)
        ) {

            alert(
                "Por favor, introduce un email o un teléfono válido."
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
