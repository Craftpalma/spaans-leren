/* =========================================
   SPAANS LEREN - CALENDARIO MASTER
========================================= */

const WORKER_URL =
    "https://spaans-leren-chatbot.newpalma.workers.dev/";


/* =========================================
   VARIABLES DEL CALENDARIO
========================================= */

let currentDate = new Date();
let selectedDate = null;

/*
   Todas las reservas cargadas desde D1.
   Se utilizan también para pintar
   el estado de cada día del calendario.
*/
let masterReservations = [];
/* =========================================
   ELEMENTOS DEL DOM
========================================= */

let calendarGrid;
let currentDateElement;
let previousMonthButton;
let nextMonthButton;
let selectedDayTitle;
let dayReservations;
let allReservations;


/* =========================================
   NOMBRES DE LOS MESES
========================================= */

const monthNames = [
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


/* =========================================
   INICIALIZAR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        calendarGrid =
            document.getElementById(
                "calendarGrid"
            );

        currentDateElement =
            document.getElementById(
                "currentDate"
            );

        previousMonthButton =
            document.getElementById(
                "previousMonth"
            );

        nextMonthButton =
            document.getElementById(
                "nextMonth"
            );

        selectedDayTitle =
            document.getElementById(
                "selectedDayTitle"
            );

        dayReservations =
            document.getElementById(
                "dayReservations"
            );

        allReservations =
            document.getElementById(
                "allReservations"
            );


        /* -----------------------------------------
           COMPROBAR ELEMENTOS
        ----------------------------------------- */

        if (!calendarGrid) {

            console.error(
                "No se encontró #calendarGrid"
            );

            return;
        }


        if (!allReservations) {

            console.error(
                "No se encontró #allReservations"
            );

        }


        /* -----------------------------------------
           BOTONES DEL MES
        ----------------------------------------- */

        if (previousMonthButton) {

            previousMonthButton.addEventListener(
                "click",
                () => {

                    currentDate.setMonth(
                        currentDate.getMonth() - 1
                    );

                    renderCalendar();

                }
            );

        }


        if (nextMonthButton) {

            nextMonthButton.addEventListener(
                "click",
                () => {

                    currentDate.setMonth(
                        currentDate.getMonth() + 1
                    );

                    renderCalendar();

                }
            );

        }


        /* -----------------------------------------
           CARGAR CALENDARIO
        ----------------------------------------- */

        renderCalendar();


        /* -----------------------------------------
           CARGAR TODAS LAS RESERVAS
        ----------------------------------------- */

        loadAllReservations();

    }
);
/* =========================================
   OBTENER ESTADO DE UN DÍA
========================================= */

function getDayReservationStatus(date) {

    const dayReservations =
        masterReservations.filter(
            reservation =>
                reservation.date === date &&
                (
                    reservation.status === "pre_reserved" ||
                    reservation.status === "booked"
                )
        );


    const preReservedTimes = new Set();

    const bookedTimes = new Set();


    dayReservations.forEach(
        reservation => {

            if (
                reservation.status === "pre_reserved"
            ) {

                preReservedTimes.add(
                    reservation.time
                );

            }


            if (
                reservation.status === "booked"
            ) {

                bookedTimes.add(
                    reservation.time
                );

            }

        }
    );


    const hasPreReserved =
        preReservedTimes.size > 0;


    const hasBooked =
        bookedTimes.size > 0;


    const hasBoth =
        hasPreReserved &&
        hasBooked;

	const preReservedCount =
    preReservedTimes.size;


	const bookedCount =
    bookedTimes.size;

    /*
       Horarios del calendario:
       09:00 hasta 19:00
       = 11 franjas
    */

    const totalSlots = 11;


    const fullyPreReserved =
        preReservedTimes.size === totalSlots;


    const fullyBooked =
        bookedTimes.size === totalSlots;


    return {

        hasPreReserved,
        hasBooked,
        hasBoth,

        fullyPreReserved,
        fullyBooked,

		preReservedCount,
    	bookedCount

    };

}

/* =========================================
   MOSTRAR CALENDARIO
========================================= */

function renderCalendar() {

    if (!calendarGrid) {
        return;
    }


    calendarGrid.innerHTML = "";


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    if (currentDateElement) {

        currentDateElement.textContent =
            `${monthNames[month]} ${year}`;

    }


    /* -----------------------------------------
       PRIMER DÍA DEL MES
    ----------------------------------------- */

    let firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    /*
       JavaScript:

       Domingo = 0
       Lunes = 1

       Lo convertimos para que
       la semana empiece en lunes.
    */

    firstDay =
        firstDay === 0
            ? 6
            : firstDay - 1;


    /* -----------------------------------------
       DÍAS DEL MES
    ----------------------------------------- */

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* -----------------------------------------
       ESPACIOS VACÍOS
    ----------------------------------------- */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "day empty";

        calendarGrid.appendChild(
            emptyDay
        );

    }


    /* -----------------------------------------
       CREAR DÍAS
    ----------------------------------------- */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement("div");


        dayElement.className =
            "day";
       
/* -----------------------------------------
   FECHA DEL DÍA
----------------------------------------- */

const dateString =
    `${year}-` +
    `${(month + 1)
        .toString()
        .padStart(2, "0")}-` +
    `${day
        .toString()
        .padStart(2, "0")}`;


/* -----------------------------------------
   ESTADO DE LAS RESERVAS
----------------------------------------- */

const dayStatus =
    getDayReservationStatus(
        dateString
    );


/* -----------------------------------------
   AÑADIR CLASE VISUAL
----------------------------------------- */

if (
    dayStatus.fullyPreReserved
) {

    dayElement.classList.add(
        "fully-pre-reserved"
    );

} else if (
    dayStatus.fullyBooked
) {

    dayElement.classList.add(
        "fully-booked"
    );

} else if (
    dayStatus.hasBoth
) {

    dayElement.classList.add(
        "both"
    );

} else if (
    dayStatus.hasPreReserved
) {

    dayElement.classList.add(
        "pre-reserved"
    );

} else if (
    dayStatus.hasBooked
) {

    dayElement.classList.add(
        "booked"
    );

}

        const dayNumber =
            document.createElement("div");


        dayNumber.className =
            "day-number";


        dayNumber.textContent =
            day;


        dayElement.appendChild(
            dayNumber
        );

		/* -----------------------------------------
		CONTADORES DE RESERVAS
		----------------------------------------- */

		if (
			dayStatus.preReservedCount > 0
		) {

			const preReservedCount =
				document.createElement("div");

			preReservedCount.className =
				"day-reservation-count pre-reserved-count";

			preReservedCount.textContent =
				dayStatus.preReservedCount;

			dayElement.appendChild(
				preReservedCount
			);

		}


		if (
			dayStatus.bookedCount > 0
		) {

			const bookedCount =
				document.createElement("div");

			bookedCount.className =
				"day-reservation-count booked-count";

			bookedCount.textContent =
				dayStatus.bookedCount;

			dayElement.appendChild(
				bookedCount
			);

		}
        /* -----------------------------------------
           CLICK EN EL DÍA
        ----------------------------------------- */

        dayElement.addEventListener(
            "click",
            () => {

                selectDay(
                    year,
                    month,
                    day
                );

            }
        );


        calendarGrid.appendChild(
            dayElement
        );

    }

}


/* =========================================
   SELECCIONAR DÍA
========================================= */

function selectDay(
    year,
    month,
    day
) {

    selectedDate =
        new Date(
            year,
            month,
            day
        );


    const formattedDate =
        `${year}-` +
        `${(month + 1)
            .toString()
            .padStart(2, "0")}-` +
        `${day
            .toString()
            .padStart(2, "0")}`;


    const displayDate =
        `${day
            .toString()
            .padStart(2, "0")}/` +
        `${(month + 1)
            .toString()
            .padStart(2, "0")}/` +
        `${year}`;


    if (selectedDayTitle) {

        selectedDayTitle.textContent =
            `Reservas del ${displayDate}`;

    }


    if (dayReservations) {

        dayReservations.innerHTML = `

            <p class="no-reservations">

                Cargando reservas...

            </p>

        `;


        loadReservationsForDay(
            formattedDate
        );

    }

}


/* =========================================
   CARGAR TODAS LAS RESERVAS DESDE D1
========================================= */

async function loadAllReservations() {

    if (!allReservations) {

        console.error(
            "No se encontró #allReservations"
        );

        return;
    }


    allReservations.innerHTML = `

        <p class="no-reservations">

            Cargando reservas...

        </p>

    `;


    try {

        console.log(
            "Consultando reservas MASTER..."
        );


        const response =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        action:
                            "master_reservations"

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Error HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Respuesta MASTER:",
            data
        );


        if (
            !data.ok ||
            !Array.isArray(
                data.reservations
            )
        ) {

            throw new Error(
                data.error ||
                "Respuesta de reservas no válida."
            );

        }

       masterReservations = data.reservations;

         renderAllReservations(
             masterReservations
         );

renderCalendar();


    } catch (error) {

        console.error(
            "Error cargando reservas:",
            error
        );


        allReservations.innerHTML = `

            <p class="no-reservations">

                No se pudieron cargar
                las reservas.

            </p>

        `;

    }

}


/* =========================================
   MOSTRAR TODAS LAS RESERVAS
========================================= */

function renderAllReservations(
    reservations
) {

    if (!allReservations) {
        return;
    }


    if (
        reservations.length === 0
    ) {

        allReservations.innerHTML = `

            <p class="no-reservations">

                No hay reservas registradas.

            </p>

        `;

        return;

    }


    allReservations.innerHTML = "";


    /*
       Ordenar por fecha y hora
    */

    reservations.sort(
        (a, b) => {

            const dateA =
                `${a.date} ${a.time}`;

            const dateB =
                `${b.date} ${b.time}`;

            return dateA.localeCompare(
                dateB
            );

        }
    );


    reservations.forEach(
        reservation => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "reservation-list-item";


            /* ---------------------------------
               ESTADO
            --------------------------------- */

            if (
                reservation.status ===
                "pre_reserved"
            ) {

                item.classList.add(
                    "pending"
                );

            } else if (
                reservation.status ===
                "booked"
            ) {

                item.classList.add(
                    "confirmed"
                );

            }


            /* ---------------------------------
               FECHA
            --------------------------------- */

            const date =
                document.createElement(
                    "div"
                );


            date.className =
                "reservation-list-date";


            date.textContent =
                `${reservation.date} · ${reservation.time}`;


            /* ---------------------------------
               NOMBRE
            --------------------------------- */

            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "reservation-list-name";


            name.textContent =
                reservation.name ||
                "Sin nombre";


            /* ---------------------------------
               TIPO DE CLASE
            --------------------------------- */

            const type =
                document.createElement(
                    "div"
                );


            type.className =
                "reservation-list-type";


            type.textContent =
                reservation.class_type ||
                "Sin especificar";


            /* ---------------------------------
               ESTADO
            --------------------------------- */

            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "reservation-list-status";


            if (
                reservation.status ===
                "pre_reserved"
            ) {

                status.textContent =
                    "🟡 Pendiente de confirmación";

            } else if (
                reservation.status ===
                "booked"
            ) {

                status.textContent =
                    "🔴 Confirmada";

            } else if (
                reservation.status ===
                "cancelled"
            ) {

                status.textContent =
                    "Cancelada";

            } else if (
                reservation.status ===
                "expired"
            ) {

                status.textContent =
                    "Expirada";

            } else {

                status.textContent =
                    reservation.status ||
                    "Estado desconocido";

            }


            /* ---------------------------------
               AÑADIR
            --------------------------------- */

            item.appendChild(
                date
            );

            item.appendChild(
                name
            );

            item.appendChild(
                type
            );

            item.appendChild(
                status
            );


            /* ---------------------------------
               CLICK
            --------------------------------- */

            item.addEventListener(
                "click",
                () => {

                    showReservationDetails(
                        reservation
                    );

                }
            );


            allReservations.appendChild(
                item
            );

        }
    );

}


/* =========================================
   CARGAR RESERVAS DE UN DÍA
========================================= */

async function loadReservationsForDay(
    date
) {

    if (!dayReservations) {
        return;
    }


    try {

        const response =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        action:
                            "master_reservations"

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Error HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.ok ||
            !Array.isArray(
                data.reservations
            )
        ) {

            throw new Error(
                data.error ||
                "Respuesta no válida."
            );

        }


        const reservations =
            data.reservations.filter(
                reservation =>
                    reservation.date === date
            );


        if (
            reservations.length === 0
        ) {

            dayReservations.innerHTML = `

                <p class="no-reservations">

                    No hay reservas para este día.

                </p>

            `;

            return;

        }


        dayReservations.innerHTML = "";


        reservations.forEach(
            reservation => {

                const detail =
                    createReservationDetail(
                        reservation
                    );


                dayReservations.appendChild(
                    detail
                );

            }
        );


    } catch (error) {

        console.error(
            "Error cargando reservas del día:",
            error
        );


        dayReservations.innerHTML = `

            <p class="no-reservations">

                No se pudieron cargar
                las reservas.

            </p>

        `;

    }

}


/* =========================================
   CREAR DETALLE DE RESERVA
========================================= */

function createReservationDetail(
    reservation
) {

    const detail =
        document.createElement(
            "div"
        );


    detail.className =
        "reservation-detail";


    if (
        reservation.status ===
        "pre_reserved"
    ) {

        detail.classList.add(
            "pending"
        );

    } else if (
        reservation.status ===
        "booked"
    ) {

        detail.classList.add(
            "confirmed"
        );

    }


    let statusText =
        reservation.status;


    if (
        reservation.status ===
        "pre_reserved"
    ) {

        statusText =
            "Pendiente de confirmación";

    } else if (
        reservation.status ===
        "booked"
    ) {

        statusText =
            "Confirmada";

    } else if (
        reservation.status ===
        "cancelled"
    ) {

        statusText =
            "Cancelada";

    } else if (
        reservation.status ===
        "expired"
    ) {

        statusText =
            "Expirada";

    }


    detail.innerHTML = `

        <p>
            <strong>Fecha:</strong>
            ${reservation.date || "—"}
        </p>

        <p>
            <strong>Hora:</strong>
            ${reservation.time || "—"}
        </p>

        <p>
            <strong>Nombre:</strong>
            ${reservation.name || "—"}
        </p>

        <p>
            <strong>Contacto:</strong>
            ${reservation.contact || "—"}
        </p>

        <p>
            <strong>Clase:</strong>
            ${reservation.class_type || "—"}
        </p>

        <p>
            <strong>Estado:</strong>
            ${statusText}
        </p>

        <p>
            <strong>Origen:</strong>
            ${reservation.source || "—"}
        </p>

    `;


    return detail;

}


/* =========================================
   MOSTRAR DETALLES DE UNA RESERVA
========================================= */

function showReservationDetails(
    reservation
) {

    console.log(
        "Reserva seleccionada:",
        reservation
    );


    /* -----------------------------------------
       SI EXISTE FECHA, SELECCIONAR SU DÍA
    ----------------------------------------- */

    if (reservation.date) {

        const parts =
            reservation.date.split("-");


        if (parts.length === 3) {

            const year =
                Number(parts[0]);

            const month =
                Number(parts[1]) - 1;

            const day =
                Number(parts[2]);


            currentDate =
                new Date(
                    year,
                    month,
                    1
                );


            renderCalendar();


         /*   selectDay(
                year,
                month,
                day
            );*/

        }

    }


    /* -----------------------------------------
       CONTENEDOR
    ----------------------------------------- */

    if (!dayReservations) {
        return;
    }


    /* -----------------------------------------
       TEXTO DEL ESTADO
    ----------------------------------------- */

    let statusText =
        reservation.status;


    if (
        reservation.status ===
        "pre_reserved"
    ) {

        statusText =
            "🟡 Pendiente de confirmación";

    } else if (
        reservation.status ===
        "booked"
    ) {

        statusText =
            "🔴 Confirmada";

    } else if (
        reservation.status ===
        "cancelled"
    ) {

        statusText =
            "Cancelada";

    } else if (
        reservation.status ===
        "expired"
    ) {

        statusText =
            "Expirada";

    }


    /* -----------------------------------------
       BOTONES
    ----------------------------------------- */

    let actions = "";


    if (
        reservation.status ===
        "pre_reserved"
    ) {

        actions = `

            <div class="reservation-detail-actions">

                <button
                    type="button"
                    class="master-action-button master-confirm-button"
                    id="masterConfirmButton"
                >
                    ✓ Confirmar reserva
                </button>

                <button
                    type="button"
                    class="master-action-button master-cancel-button"
                    id="masterCancelButton"
                >
                    ✕ Cancelar reserva
                </button>

            </div>

        `;

    } else if (
        reservation.status ===
        "booked"
    ) {

        actions = `

            <div class="reservation-detail-actions">

                <button
                    type="button"
                    class="master-action-button master-cancel-button"
                    id="masterCancelButton"
                >
                    ✕ Cancelar reserva
                </button>

            </div>

        `;

    }


    /* -----------------------------------------
       MOSTRAR PANEL
    ----------------------------------------- */

    dayReservations.innerHTML = `

        <div class="reservation-detail-panel">

            <h3>
                Detalle de la reserva
            </h3>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Fecha
                </div>

                <div class="reservation-detail-value">
                    ${reservation.date || "—"}
                </div>

            </div>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Hora
                </div>

                <div class="reservation-detail-value">
                    ${reservation.time || "—"}
                </div>

            </div>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Nombre
                </div>

                <div class="reservation-detail-value">
                    ${reservation.name || "—"}
                </div>

            </div>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Contacto
                </div>

                <div class="reservation-detail-value">
                    ${reservation.contact || "—"}
                </div>

            </div>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Clase
                </div>

                <div class="reservation-detail-value">
                    ${reservation.class_type || "—"}
                </div>

            </div>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Estado
                </div>

                <div class="reservation-detail-value">
                    ${statusText}
                </div>

            </div>


            <div class="reservation-detail-row">

                <div class="reservation-detail-label">
                    Origen
                </div>

                <div class="reservation-detail-value">
                    ${reservation.source || "—"}
                </div>

            </div>


            ${actions}

        </div>

    `;


    /* -----------------------------------------
       BOTÓN CONFIRMAR
    ----------------------------------------- */

    const confirmButton =
        document.getElementById(
            "masterConfirmButton"
        );


    if (confirmButton) {

        confirmButton.addEventListener(
            "click",
            () => {

                console.log(
                    "CONFIRMAR:",
                    reservation
                );


                alert(
                    "La confirmación la conectaremos al Worker en el siguiente paso."
                );

            }
        );

    }


    /* -----------------------------------------
       BOTÓN CANCELAR
    ----------------------------------------- */

    const cancelButton =
        document.getElementById(
            "masterCancelButton"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {

                console.log(
                    "CANCELAR:",
                    reservation
                );


                alert(
                    "La cancelación la conectaremos al Worker en el siguiente paso."
                );

            }
        );

    }

}





/* =========================================
   FIN
========================================= */
