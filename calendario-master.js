/* =========================================
   SPAANS LEREN - CALENDARIO MASTER
========================================= */

const WORKER_URL =
    "https://spaans-leren-chatbot.newpalma.workers.dev/";


/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const reservationList =
    document.getElementById("reservationList");


/* =========================================
   CARGAR TODAS LAS RESERVAS
========================================= */

async function loadAllReservations() {

    if (!reservationList) {

        console.error(
            "No se encontró #reservationList en calendario-master.html"
        );

        return;
    }

    /* -----------------------------------------
       MENSAJE DE CARGA
    ----------------------------------------- */

    reservationList.innerHTML = `
        <p>
            Cargando reservas...
        </p>
    `;


    try {

        const response = await fetch(
            `${WORKER_URL}?master=reservations`
        );


        /* -----------------------------------------
           COMPROBAR RESPUESTA
        ----------------------------------------- */

        if (!response.ok) {

            throw new Error(
                `Error HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "Reservas recibidas:",
            data
        );


        /* -----------------------------------------
           COMPROBAR RESULTADO
        ----------------------------------------- */

        if (
            !data.ok ||
            !Array.isArray(data.reservations)
        ) {

            throw new Error(
                "Respuesta de reservas no válida."
            );
        }


        /* -----------------------------------------
           MOSTRAR RESERVAS
        ----------------------------------------- */

        renderReservations(
            data.reservations
        );


    } catch (error) {

        console.error(
            "Error cargando reservas:",
            error
        );


        reservationList.innerHTML = `
            <p>
                No se pudieron cargar las reservas.
            </p>
        `;
    }
}


/* =========================================
   MOSTRAR RESERVAS
========================================= */

function renderReservations(
    reservations
) {

    if (!reservationList) {
        return;
    }


    /* -----------------------------------------
       NO HAY RESERVAS
    ----------------------------------------- */

    if (
        reservations.length === 0
    ) {

        reservationList.innerHTML = `
            <p>
                No hay reservas.
            </p>
        `;

        return;
    }


    /* -----------------------------------------
       LIMPIAR LISTA
    ----------------------------------------- */

    reservationList.innerHTML = "";


    /* -----------------------------------------
       CREAR CADA RESERVA
    ----------------------------------------- */

    reservations.forEach(
        reservation => {

            const item =
                document.createElement("div");


            item.className =
                "reservation-list-item";


            /* ---------------------------------
               ESTADO VISUAL
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
                document.createElement("div");

            date.className =
                "reservation-list-date";

            date.textContent =
                `${reservation.date} — ${reservation.time}`;


            /* ---------------------------------
               NOMBRE
            --------------------------------- */

            const name =
                document.createElement("div");

            name.className =
                "reservation-list-name";

            name.textContent =
                reservation.name ||
                "Sin nombre";


            /* ---------------------------------
               TIPO DE CLASE
            --------------------------------- */

            const type =
                document.createElement("div");

            type.className =
                "reservation-list-type";

            type.textContent =
                reservation.class_type ||
                "Tipo de clase no especificado";


            /* ---------------------------------
               ESTADO
            --------------------------------- */

            const status =
                document.createElement("div");

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
                    reservation.status;
            }


            /* ---------------------------------
               AÑADIR ELEMENTOS
            --------------------------------- */

            item.appendChild(date);

            item.appendChild(name);

            item.appendChild(type);

            item.appendChild(status);


            /* ---------------------------------
               CLICK EN RESERVA
            --------------------------------- */

            item.addEventListener(
                "click",
                () => {

                    showReservationDetails(
                        reservation
                    );

                }
            );


            reservationList.appendChild(
                item
            );
        }
    );
}


/* =========================================
   MOSTRAR INFORMACIÓN DE UNA RESERVA
========================================= */

function showReservationDetails(
    reservation
) {

    console.log(
        "Reserva seleccionada:",
        reservation
    );


    /*
       De momento mostramos la información
       en una ventana sencilla.

       Después sustituiremos esto por un
       panel profesional con botones:

       CONFIRMAR
       CANCELAR
    */

    const message = `

Fecha: ${reservation.date}

Hora: ${reservation.time}

Nombre: ${reservation.name || "—"}

Contacto: ${reservation.contact || "—"}

Clase: ${reservation.class_type || "—"}

Estado: ${reservation.status}

    `;


    alert(
        message
    );
}


/* =========================================
   INICIAR
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAllReservations();

    }
);
