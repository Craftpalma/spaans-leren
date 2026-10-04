
/* =========================================
   SPAANS LEREN - CALENDARIO MASTER
========================================= */

const WORKER_URL =
    "https://spaans-leren-chatbot.newpalma.workers.dev/";


/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const reservationList =
    document.getElementById("allReservations");


/* =========================================
   CARGAR TODAS LAS RESERVAS
========================================= */

async function loadAllReservations() {

    if (!reservationList) {

        console.error(
            "No se encontró #allReservations en calendario-master.html"
        );

        return;
    }


    /* -----------------------------------------
       MENSAJE DE CARGA
    ----------------------------------------- */

    reservationList.innerHTML = `
        <p class="no-reservations">
            Cargando reservas...
        </p>
    `;


    try {

        /* -----------------------------------------
           CONSULTAR WORKER
        ----------------------------------------- */

        const response = await fetch(
            WORKER_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    action: "master_reservations"
                })
            }
        );


        /* -----------------------------------------
           COMPROBAR RESPUESTA HTTP
        ----------------------------------------- */

        if (!response.ok) {

            throw new Error(
                `Error HTTP ${response.status}`
            );
        }


        /* -----------------------------------------
           CONVERTIR RESPUESTA A JSON
        ----------------------------------------- */

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
                data.error ||
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
            <p class="no-reservations">
                No se pudieron cargar las reservas.
            </p>
        `;
    }
}


/* =========================================
   MOSTRAR TODAS LAS RESERVAS
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
            <p class="no-reservations">
                No hay reservas registradas.
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
               FECHA Y HORA
            --------------------------------- */

            const date =
                document.createElement("div");

            date.className =
                "reservation-list-date";

            date.textContent =
                `${reservation.date} · ${reservation.time}`;


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
                    reservation.status ||
                    "Estado desconocido";
            }


            /* ---------------------------------
               AÑADIR INFORMACIÓN
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
               CLICK EN LA RESERVA
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


    /* -----------------------------------------
       CONVERTIR ESTADO A TEXTO
    ----------------------------------------- */

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


    /* -----------------------------------------
       MOSTRAR EN EL PANEL DE DETALLES
    ----------------------------------------- */

    const details =
        document.getElementById(
            "dayReservations"
        );

    const title =
        document.getElementById(
            "selectedDayTitle"
        );


    if (
        !details ||
        !title
    ) {

        console.error(
            "No se encontró el panel de detalles."
        );

        return;
    }


    title.textContent =
        "Detalle de la reserva";


    details.innerHTML = `

        <div class="
            reservation-detail
            ${reservation.status === "pre_reserved"
                ? "pending"
                : ""}
            ${reservation.status === "booked"
                ? "confirmed"
                : ""}
        ">

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
                ${reservation.name || "No indicado"}
            </p>

            <p>
                <strong>Contacto:</strong>
                ${reservation.contact || "No indicado"}
            </p>

            <p>
                <strong>Clase:</strong>
                ${reservation.class_type || "No especificada"}
            </p>

            <p>
                <strong>Estado:</strong>
                ${statusText || "—"}
            </p>

            <p>
                <strong>Origen:</strong>
                ${reservation.source || "No indicado"}
            </p>

        </div>

    `;


    /* -----------------------------------------
       LLEVAR AL USUARIO AL DETALLE
    ----------------------------------------- */

    details.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
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

