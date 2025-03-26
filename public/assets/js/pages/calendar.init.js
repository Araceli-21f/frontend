/* global bootstrap, FullCalendar */

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM completamente cargado");

    var modalElement = document.getElementById("event-modal");
    var calendarElement = document.getElementById("calendar");

    var modal = null;
    if (modalElement) {
        try {
            modal = new bootstrap.Modal(modalElement, { keyboard: false });
            console.log("✅ Bootstrap Modal inicializado");
        } catch (error) {
            console.error("⚠️ Error al inicializar Bootstrap Modal:", error);
        }
    } else {
        console.error("⚠️ Error: El elemento #event-modal no se encontró en el DOM.");
    }

    if (calendarElement) {
        try {
            var calendar = new FullCalendar.Calendar(calendarElement, {
                plugins: [FullCalendar.dayGridPlugin], // Asegúrate de que esté importado
                timeZone: "local",
                editable: true,
                droppable: true,
                selectable: true,
                navLinks: true,
                initialView: "dayGridMonth",
                themeSystem: "bootstrap",
                headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                },
                eventClick: function (info) {
                    console.log("📌 Evento clickeado:", info.event.title);

                    var editEventBtn = document.getElementById("edit-event-btn");
                    var btnSaveEvent = document.getElementById("btn-save-event");
                    var btnDeleteEvent = document.getElementById("btn-delete-event");
                    var eventTitle = document.getElementById("event-title");
                    var eventCategory = document.getElementById("event-category");

                    if (editEventBtn) {
                        editEventBtn.removeAttribute("hidden");
                        editEventBtn.setAttribute("data-id", "edit-event");
                        editEventBtn.innerHTML = "Edit";
                    }

                    if (btnSaveEvent) btnSaveEvent.setAttribute("hidden", true);
                    if (eventTitle) eventTitle.value = info.event.title;
                    if (eventCategory) eventCategory.value = info.event.classNames[0];
                    if (btnDeleteEvent) btnDeleteEvent.removeAttribute("hidden");

                    eventClicked();

                    if (modal) {
                        modal.show();
                    } else {
                        console.error("⚠️ Error: modal no está definido.");
                    }
                },
                events: [
                    { title: "All Day Event", start: "2024-03-01" },
                    { title: "Meeting", start: "2024-03-01T10:30:00", className: "bg-success" }
                ]
            });

            calendar.render();
            console.log("✅ FullCalendar inicializado correctamente");
        } catch (error) {
            console.error("⚠️ Error al inicializar FullCalendar:", error);
        }
    } else {
        console.error("⚠️ Error: No se encontró el elemento #calendar en el DOM.");
    }

    var btnDeleteEvent = document.getElementById("btn-delete-event");
    if (btnDeleteEvent) {
        btnDeleteEvent.addEventListener("click", function () {
            console.log("🗑️ Evento eliminado");
            if (modal) modal.hide();
        });
    } else {
        console.error("⚠️ Error: El botón de eliminar no existe en el DOM.");
    }

    var btnSaveEvent = document.getElementById("btn-save-event");
    if (btnSaveEvent) {
        btnSaveEvent.addEventListener("click", function () {
            var eventTitleElement = document.getElementById("event-title");
            var eventCategoryElement = document.getElementById("event-category");

            if (eventTitleElement && eventCategoryElement) {
                console.log("📌 Guardando evento:");
                console.log("Título:", eventTitleElement.value);
                console.log("Categoría:", eventCategoryElement.value);
            } else {
                console.error("⚠️ Error: No se encontraron los elementos #event-title o #event-category en el DOM.");
            }

            if (modal) modal.hide();
        });
    } else {
        console.error("⚠️ Error: El botón de guardar no existe en el DOM.");
    }
});

function eventClicked() {
    var formEvent = document.getElementById("form-event");
    if (formEvent) {
        formEvent.classList.add("view-event");
    } else {
        console.error("⚠️ Error: El elemento #form-event no se encontró en el DOM.");
    }
}

function editEvent(e) {
    var t = e.getAttribute("data-id");

    var modalTitle = document.getElementById("modal-title");
    var btnSaveEvent = document.getElementById("btn-save-event");

    if (t === "new-event") {
        if (modalTitle) modalTitle.innerHTML = "Add Event";
        if (btnSaveEvent) btnSaveEvent.innerHTML = "Add Event";
        eventTyped();
    } else if (t === "edit-event") {
        e.innerHTML = "Cancel";
        if (btnSaveEvent) btnSaveEvent.innerHTML = "Update Event";
        e.removeAttribute("hidden");
        eventTyped();
    } else {
        e.innerHTML = "Edit";
        eventClicked();
    }
}

function eventTyped() {
    var formEvent = document.getElementById("form-event");
    if (formEvent) {
        formEvent.classList.remove("view-event");
    } else {
        console.error("⚠️ Error: El elemento #form-event no se encontró en el DOM.");
    }
}
