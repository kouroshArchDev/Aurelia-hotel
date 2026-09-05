document.addEventListener("DOMContentLoaded", () => {
    /* =========================================================
       AURELIA HOTEL — BOOKING BAR
       Complete standalone booking system
       ========================================================= */

    /* =========================================================
       ELEMENTS
       ========================================================= */

    const checkInTrigger =
        document.getElementById("booking-checkin");

    const checkOutTrigger =
        document.getElementById("booking-checkout");

    const guestsTrigger =
        document.getElementById("booking-guests");

    const submitButton =
        document.getElementById("booking-submit");

    if (
        !checkInTrigger ||
        !checkOutTrigger ||
        !guestsTrigger ||
        !submitButton
    ) {
        console.warn(
            "Aurelia Booking Bar: required elements not found."
        );

        return;
    }

    /* =========================================================
       BOOKING STATE
       ========================================================= */

    const bookingState = {
        checkIn: null,
        checkOut: null,
        guests: 2
    };

    let activeCalendar = null;
    let activeCalendarType = null;

    /* =========================================================
       HELPERS
       ========================================================= */

    function pad(number) {
        return String(number).padStart(2, "0");
    }

    function toISO(date) {
        return (
            `${date.getFullYear()}-` +
            `${pad(date.getMonth() + 1)}-` +
            `${pad(date.getDate())}`
        );
    }

    function getToday() {
        const date = new Date();

        date.setHours(
            0,
            0,
            0,
            0
        );

        return date;
    }

    function formatDate(value) {
        if (!value) {
            return "Select Date";
        }

        return new Date(
            `${value}T00:00:00`
        ).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );
    }

    /* =========================================================
       GUESTS
       ========================================================= */

    function updateGuests() {
        guestsTrigger.textContent =
            `${bookingState.guests} ${
                bookingState.guests === 1
                    ? "Guest"
                    : "Guests"
            }`;
    }

    guestsTrigger.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            bookingState.guests += 1;

            if (bookingState.guests > 12) {
                bookingState.guests = 1;
            }

            updateGuests();
        }
    );

    /* =========================================================
       CLOSE CALENDAR
       ========================================================= */

    function closeCalendar() {
        if (activeCalendar) {
            activeCalendar.remove();
        }

        activeCalendar = null;
        activeCalendarType = null;
    }

    /* =========================================================
       CREATE CALENDAR
       ========================================================= */

    function createCalendar(type) {
        const trigger =
            type === "checkIn"
                ? checkInTrigger
                : checkOutTrigger;

        if (!trigger) {
            return;
        }

        closeCalendar();

        activeCalendarType = type;

        const selectedValue =
            type === "checkIn"
                ? bookingState.checkIn
                : bookingState.checkOut;

        let calendarMonth =
            selectedValue
                ? new Date(
                    `${selectedValue}T00:00:00`
                )
                : new Date();

        calendarMonth.setDate(1);

        /* =====================================================
           CALENDAR ELEMENT
           ===================================================== */

        const calendar =
            document.createElement("div");

        calendar.className =
            "aurelia-booking-calendar";

        calendar.style.cssText = `
            position: fixed;
            width: 320px;
            max-width: calc(100vw - 32px);
            padding: 18px;
            background: #f8f6f1;
            color: #263238;
            border: 1px solid rgba(38, 50, 56, 0.12);
            border-radius: 4px;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
            z-index: 2147483647;
            font-family: var(--font-sans, Arial, sans-serif);
        `;

        calendar.innerHTML = `
            <div
                class="aurelia-calendar-header"
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:12px;
                    margin-bottom:16px;
                "
            >
                <button
                    type="button"
                    class="aurelia-calendar-prev"
                    aria-label="Previous month"
                    style="
                        width:32px;
                        height:32px;
                        border:0;
                        background:transparent;
                        color:#263238;
                        font-size:24px;
                        cursor:pointer;
                    "
                >
                    ‹
                </button>

                <strong
                    class="aurelia-calendar-title"
                    style="
                        font-size:13px;
                        font-weight:600;
                        letter-spacing:0.04em;
                    "
                ></strong>

                <button
                    type="button"
                    class="aurelia-calendar-next"
                    aria-label="Next month"
                    style="
                        width:32px;
                        height:32px;
                        border:0;
                        background:transparent;
                        color:#263238;
                        font-size:24px;
                        cursor:pointer;
                    "
                >
                    ›
                </button>
            </div>

            <div
                style="
                    display:grid;
                    grid-template-columns:repeat(7, 1fr);
                    gap:4px;
                    margin-bottom:7px;
                    text-align:center;
                    font-size:9px;
                    font-weight:600;
                    letter-spacing:0.08em;
                    text-transform:uppercase;
                    color:rgba(35,39,42,0.48);
                "
            >
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
            </div>

            <div
                class="aurelia-calendar-days"
                style="
                    display:grid;
                    grid-template-columns:repeat(7, 1fr);
                    gap:4px;
                "
            ></div>
        `;

        document.body.appendChild(calendar);

        activeCalendar = calendar;

        /* =====================================================
           POSITION
           ===================================================== */

        function positionCalendar() {
            if (!activeCalendar) {
                return;
            }

            const rect =
                trigger.getBoundingClientRect();

            const width =
                Math.min(
                    320,
                    window.innerWidth - 32
                );

            let left =
                rect.left +
                rect.width / 2 -
                width / 2;

            let top =
                rect.bottom + 12;

            left =
                Math.max(
                    16,
                    Math.min(
                        left,
                        window.innerWidth -
                        width -
                        16
                    )
                );

            const estimatedHeight = 370;

            if (
                top + estimatedHeight >
                window.innerHeight - 16
            ) {
                top =
                    rect.top -
                    estimatedHeight -
                    12;
            }

            top =
                Math.max(
                    16,
                    top
                );

            calendar.style.width =
                `${width}px`;

            calendar.style.left =
                `${left}px`;

            calendar.style.top =
                `${top}px`;
        }

        positionCalendar();

        /* =====================================================
           RENDER CALENDAR
           ===================================================== */

        function renderCalendar() {
            if (!activeCalendar) {
                return;
            }

            const year =
                calendarMonth.getFullYear();

            const month =
                calendarMonth.getMonth();

            const today =
                getToday();

            const title =
                calendar.querySelector(
                    ".aurelia-calendar-title"
                );

            const daysContainer =
                calendar.querySelector(
                    ".aurelia-calendar-days"
                );

            title.textContent =
                calendarMonth.toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

            daysContainer.innerHTML = "";

            const firstDay =
                new Date(
                    year,
                    month,
                    1
                ).getDay();

            const daysInMonth =
                new Date(
                    year,
                    month + 1,
                    0
                ).getDate();

            let minimumCheckOut =
                today;

            if (bookingState.checkIn) {
                minimumCheckOut =
                    new Date(
                        `${bookingState.checkIn}T00:00:00`
                    );
            }

            /* Empty cells */

            for (
                let i = 0;
                i < firstDay;
                i += 1
            ) {
                const empty =
                    document.createElement(
                        "span"
                    );

                empty.style.height =
                    "34px";

                daysContainer.appendChild(
                    empty
                );
            }

            /* Days */

            for (
                let day = 1;
                day <= daysInMonth;
                day += 1
            ) {
                const date =
                    new Date(
                        year,
                        month,
                        day
                    );

                const value =
                    toISO(date);

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.textContent =
                    String(day);

                button.style.cssText = `
                    height:34px;
                    border:0;
                    border-radius:4px;
                    background:transparent;
                    color:#263238;
                    font-family:inherit;
                    font-size:12px;
                    cursor:pointer;
                    transition:
                        background-color 160ms ease,
                        color 160ms ease;
                `;

                let disabled = false;

                if (type === "checkIn") {
                    disabled =
                        date < today;
                } else {
                    disabled =
                        date <= minimumCheckOut;
                }

                if (disabled) {
                    button.disabled =
                        true;

                    button.style.opacity =
                        "0.30";

                    button.style.cursor =
                        "default";
                }

                button.addEventListener(
                    "mouseenter",
                    () => {
                        if (!disabled) {
                            button.style.background =
                                "rgba(154,121,82,0.10)";

                            button.style.color =
                                "#9a7952";
                        }
                    }
                );

                button.addEventListener(
                    "mouseleave",
                    () => {
                        button.style.background =
                            "transparent";

                        button.style.color =
                            "#263238";
                    }
                );

                button.addEventListener(
                    "click",
                    () => {
                        if (disabled) {
                            return;
                        }

                        if (
                            type === "checkIn"
                        ) {
                            bookingState.checkIn =
                                value;

                            bookingState.checkOut =
                                null;

                            checkInTrigger.textContent =
                                formatDate(value);

                            checkOutTrigger.textContent =
                                "Select Date";

                            closeCalendar();

                            createCalendar(
                                "checkOut"
                            );

                            return;
                        }

                        bookingState.checkOut =
                            value;

                        checkOutTrigger.textContent =
                            formatDate(value);

                        closeCalendar();
                    }
                );

                daysContainer.appendChild(
                    button
                );
            }

            /* =================================================
               MONTH NAVIGATION
               ================================================= */

            const previousButton =
                calendar.querySelector(
                    ".aurelia-calendar-prev"
                );

            const nextButton =
                calendar.querySelector(
                    ".aurelia-calendar-next"
                );

            previousButton.onclick =
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const previousMonth =
                        new Date(
                            year,
                            month - 1,
                            1
                        );

                    const currentMonth =
                        new Date();

                    currentMonth.setDate(1);
                    currentMonth.setHours(0, 0, 0, 0);

                    if (
                        previousMonth >=
                        currentMonth
                    ) {
                        calendarMonth =
                            previousMonth;

                        renderCalendar();
                    }
                };

            nextButton.onclick =
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    calendarMonth =
                        new Date(
                            year,
                            month + 1,
                            1
                        );

                    renderCalendar();
                };
        }

        renderCalendar();

        calendar.addEventListener(
            "click",
            (event) => {
                event.stopPropagation();
            }
        );
    }

    /* =========================================================
       CHECK-IN
       ========================================================= */

    checkInTrigger.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (
                activeCalendar &&
                activeCalendarType === "checkIn"
            ) {
                closeCalendar();
                return;
            }

            createCalendar("checkIn");
        }
    );

    /* =========================================================
       CHECK-OUT
       ========================================================= */

    checkOutTrigger.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!bookingState.checkIn) {
                createCalendar("checkIn");
                return;
            }

            if (
                activeCalendar &&
                activeCalendarType === "checkOut"
            ) {
                closeCalendar();
                return;
            }

            createCalendar("checkOut");
        }
    );

    /* =========================================================
       OUTSIDE CLICK
       ========================================================= */

    document.addEventListener(
        "click",
        (event) => {
            const target =
                event.target;

            if (
                activeCalendar &&
                !activeCalendar.contains(target) &&
                target !== checkInTrigger &&
                target !== checkOutTrigger
            ) {
                closeCalendar();
            }
        }
    );

    /* =========================================================
       ESCAPE
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                closeCalendar();
            }
        }
    );

    /* =========================================================
       RESIZE
       ========================================================= */

    window.addEventListener(
        "resize",
        () => {
            if (activeCalendar) {
                const trigger =
                    activeCalendarType === "checkIn"
                        ? checkInTrigger
                        : checkOutTrigger;

                const rect =
                    trigger.getBoundingClientRect();

                const width =
                    Math.min(
                        320,
                        window.innerWidth - 32
                    );

                let left =
                    rect.left +
                    rect.width / 2 -
                    width / 2;

                let top =
                    rect.bottom + 12;

                left =
                    Math.max(
                        16,
                        Math.min(
                            left,
                            window.innerWidth -
                            width -
                            16
                        )
                    );

                if (
                    top + 370 >
                    window.innerHeight - 16
                ) {
                    top =
                        rect.top -
                        382;
                }

                top =
                    Math.max(
                        16,
                        top
                    );

                activeCalendar.style.width =
                    `${width}px`;

                activeCalendar.style.left =
                    `${left}px`;

                activeCalendar.style.top =
                    `${top}px`;
            }
        }
    );

    /* =========================================================
       CHECK AVAILABILITY
       ========================================================= */

    submitButton.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!bookingState.checkIn) {
                createCalendar("checkIn");
                return;
            }

            if (!bookingState.checkOut) {
                createCalendar("checkOut");
                return;
            }

            const checkInDate =
                new Date(
                    `${bookingState.checkIn}T00:00:00`
                );

            const checkOutDate =
                new Date(
                    `${bookingState.checkOut}T00:00:00`
                );

            if (
                checkOutDate <=
                checkInDate
            ) {
                alert(
                    "Check-out must be after check-in."
                );

                return;
            }

            console.log(
                "Aurelia Booking Search",
                {
                    checkIn:
                        bookingState.checkIn,

                    checkOut:
                        bookingState.checkOut,

                    guests:
                        bookingState.guests
                }
            );

            const searchSection =
                document.getElementById("search");

            if (searchSection) {
                searchSection.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "start"
                    }
                );
            }
        }
    );

    /* =========================================================
       INITIAL STATE
       ========================================================= */

    updateGuests();

    checkInTrigger.textContent =
        "Select Date";

    checkOutTrigger.textContent =
        "Select Date";
});
/* =========================================================
   AURELIA HOTEL — MAIN.JS
   SECTION 2 / 3
   ========================================================= */

/* =========================================================
   FAQ ACCORDION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const question =
            item.querySelector(".faq-question");

        const answer =
            item.querySelector(".faq-answer");

        if (!question || !answer) {
            return;
        }

        question.setAttribute(
            "aria-expanded",
            "false"
        );

        answer.setAttribute(
            "aria-hidden",
            "true"
        );

        question.addEventListener(
            "click",
            () => {
                const isOpen =
                    item.classList.contains(
                        "is-open"
                    );

                faqItems.forEach((otherItem) => {
                    otherItem.classList.remove(
                        "is-open"
                    );

                    const otherQuestion =
                        otherItem.querySelector(
                            ".faq-question"
                        );

                    const otherAnswer =
                        otherItem.querySelector(
                            ".faq-answer"
                        );

                    if (otherQuestion) {
                        otherQuestion.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }

                    if (otherAnswer) {
                        otherAnswer.setAttribute(
                            "aria-hidden",
                            "true"
                        );
                    }
                });

                if (!isOpen) {
                    item.classList.add(
                        "is-open"
                    );

                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                    answer.setAttribute(
                        "aria-hidden",
                        "false"
                    );
                }
            }
        );
    });
});


/* =========================================================
   ROOM / CARD INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const cards =
        document.querySelectorAll(
            ".room-card, .card"
        );

    cards.forEach((card) => {
        const link =
            card.querySelector(
                "a"
            );

        if (!link) {
            return;
        }

        card.addEventListener(
            "click",
            (event) => {
                if (
                    event.target.closest(
                        "a, button"
                    )
                ) {
                    return;
                }

                link.click();
            }
        );
    });
});


/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const revealElements =
        document.querySelectorAll(
            ".reveal-on-scroll, " +
            ".section-heading, " +
            ".card, " +
            ".room-card, " +
            ".amenity-card"
        );

    if (!revealElements.length) {
        return;
    }

    if (
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach(
            (element) => {
                element.classList.add(
                    "is-visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach(
                    (entry) => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    revealElements.forEach(
        (element) => {
            observer.observe(element);
        }
    );
});


/* =========================================================
   SMOOTH ANCHOR LINKS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    anchorLinks.forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const href =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !href ||
                    href === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        href
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });
});


/* =========================================================
   BACK TO TOP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const backToTop =
        document.querySelector(
            ".back-to-top"
        );

    if (!backToTop) {
        return;
    }

    function updateBackToTop() {
        backToTop.classList.toggle(
            "is-visible",
            window.scrollY > 500
        );
    }

    window.addEventListener(
        "scroll",
        updateBackToTop,
        {
            passive: true
        }
    );

    updateBackToTop();

    backToTop.addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );
});


/* =========================================================
   NEWSLETTER FORM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const newsletterForms =
        document.querySelectorAll(
            ".newsletter-form"
        );

    newsletterForms.forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const input =
                    form.querySelector(
                        'input[type="email"]'
                    );

                if (!input) {
                    return;
                }

                const email =
                    input.value.trim();

                if (!email) {
                    input.focus();
                    return;
                }

                if (
                    !input.checkValidity()
                ) {
                    input.reportValidity();
                    return;
                }

                form.classList.add(
                    "is-success"
                );

                input.value = "";

                const message =
                    form.querySelector(
                        ".newsletter-message"
                    );

                if (message) {
                    message.textContent =
                        "Thank you for subscribing.";
                }
            }
        );
    });
});


/* =========================================================
   CONTACT FORM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const contactForms =
        document.querySelectorAll(
            ".contact-form"
        );

    contactForms.forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const fields =
                    form.querySelectorAll(
                        "input, select, textarea"
                    );

                let valid = true;

                fields.forEach((field) => {
                    if (
                        field.hasAttribute(
                            "required"
                        ) &&
                        !field.value.trim()
                    ) {
                        valid = false;

                        field.classList.add(
                            "is-error"
                        );
                    } else {
                        field.classList.remove(
                            "is-error"
                        );
                    }
                });

                if (!valid) {
                    const firstError =
                        form.querySelector(
                            ".is-error"
                        );

                    if (firstError) {
                        firstError.focus();
                    }

                    return;
                }

                form.classList.add(
                    "is-success"
                );

                const successMessage =
                    form.querySelector(
                        ".form-success"
                    );

                if (successMessage) {
                    successMessage.hidden =
                        false;
                }
            }
        );

        form.addEventListener(
            "input",
            (event) => {
                event.target.classList.remove(
                    "is-error"
                );
            }
        );
    });
});


/* =========================================================
   MODAL SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const modalTriggers =
        document.querySelectorAll(
            "[data-modal-target]"
        );

    const modals =
        document.querySelectorAll(
            ".modal"
        );

    let activeModal = null;

    function closeModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (
            activeModal === modal
        ) {
            activeModal = null;
        }

        document.body.classList.remove(
            "modal-open"
        );
    }

    function openModal(modal) {
        if (!modal) {
            return;
        }

        if (
            activeModal &&
            activeModal !== modal
        ) {
            closeModal(activeModal);
        }

        modal.classList.add(
            "is-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        activeModal = modal;

        document.body.classList.add(
            "modal-open"
        );
    }

    modals.forEach((modal) => {
        modal.setAttribute(
            "aria-hidden",
            modal.classList.contains(
                "is-open"
            )
                ? "false"
                : "true"
        );

        const closeButtons =
            modal.querySelectorAll(
                ".modal-close, " +
                "[data-modal-close]"
            );

        closeButtons.forEach(
            (button) => {
                button.addEventListener(
                    "click",
                    () => {
                        closeModal(modal);
                    }
                );
            }
        );

        modal.addEventListener(
            "click",
            (event) => {
                if (
                    event.target === modal
                ) {
                    closeModal(modal);
                }
            }
        );
    });

    modalTriggers.forEach(
        (trigger) => {
            trigger.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();

                    const targetSelector =
                        trigger.getAttribute(
                            "data-modal-target"
                        );

                    if (
                        !targetSelector
                    ) {
                        return;
                    }

                    const modal =
                        document.querySelector(
                            targetSelector
                        );

                    openModal(modal);
                }
            );
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape" &&
                activeModal
            ) {
                closeModal(activeModal);
            }
        }
    );
});


/* =========================================================
   DROPDOWN GENERIC SYSTEM
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const dropdowns =
        document.querySelectorAll(
            "[data-dropdown]"
        );

    dropdowns.forEach((dropdown) => {
        const toggle =
            dropdown.querySelector(
                "[data-dropdown-toggle]"
            );

        const menu =
            dropdown.querySelector(
                "[data-dropdown-menu]"
            );

        if (!toggle || !menu) {
            return;
        }

        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

        function close() {
            dropdown.classList.remove(
                "is-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        function open() {
            dropdown.classList.add(
                "is-open"
            );

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        toggle.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    dropdown.classList.contains(
                        "is-open"
                    );

                dropdowns.forEach(
                    (item) => {
                        if (
                            item !==
                            dropdown
                        ) {
                            item.classList.remove(
                                "is-open"
                            );

                            const itemToggle =
                                item.querySelector(
                                    "[data-dropdown-toggle]"
                                );

                            if (
                                itemToggle
                            ) {
                                itemToggle.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );
                            }
                        }
                    }
                );

                if (isOpen) {
                    close();
                } else {
                    open();
                }
            }
        );
    });

    document.addEventListener(
        "click",
        () => {
            dropdowns.forEach(
                (dropdown) => {
                    dropdown.classList.remove(
                        "is-open"
                    );

                    const toggle =
                        dropdown.querySelector(
                            "[data-dropdown-toggle]"
                        );

                    if (toggle) {
                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }
            );
        }
    );
});
/* =========================================================
   AURELIA HOTEL — MAIN.JS
   SECTION 3 / 3
   ========================================================= */

/* =========================================================
   LAZY IMAGE LOADING FALLBACK
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const images =
        document.querySelectorAll(
            "img[data-src]"
        );

    if (!images.length) {
        return;
    }

    if (
        !("IntersectionObserver" in window)
    ) {
        images.forEach((image) => {
            const source =
                image.getAttribute(
                    "data-src"
                );

            if (source) {
                image.src = source;
            }

            image.removeAttribute(
                "data-src"
            );
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach(
                    (entry) => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const image =
                            entry.target;

                        const source =
                            image.getAttribute(
                                "data-src"
                            );

                        if (source) {
                            image.src =
                                source;
                        }

                        image.removeAttribute(
                            "data-src"
                        );

                        observerInstance.unobserve(
                            image
                        );
                    }
                );
            },
            {
                rootMargin:
                    "200px 0px"
            }
        );

    images.forEach(
        (image) => {
            observer.observe(image);
        }
    );
});


/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const images =
        document.querySelectorAll(
            "img"
        );

    images.forEach((image) => {
        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "image-error"
                );
            }
        );
    });
});


/* =========================================================
   YEAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );

    const year =
        new Date().getFullYear();

    yearElements.forEach(
        (element) => {
            element.textContent =
                String(year);
        }
    );
});


/* =========================================================
   BODY SCROLL LOCK
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const lockClass =
        "body-scroll-locked";

    function updateScrollLock() {
        const hasOpenOverlay =
            document.querySelector(
                ".modal.is-open, " +
                ".drawer.is-open, " +
                ".mobile-navigation.is-open, " +
                ".search-panel.is-open"
            );

        document.body.classList.toggle(
            lockClass,
            Boolean(hasOpenOverlay)
        );
    }

    const observer =
        new MutationObserver(
            updateScrollLock
        );

    observer.observe(
        document.body,
        {
            subtree: true,
            attributes: true,
            attributeFilter: [
                "class"
            ]
        }
    );

    updateScrollLock();
});


/* =========================================================
   ACCESSIBILITY — TAB / FOCUS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const interactiveElements =
        document.querySelectorAll(
            "button, " +
            "a, " +
            "input, " +
            "select, " +
            "textarea"
        );

    interactiveElements.forEach(
        (element) => {
            element.addEventListener(
                "focus",
                () => {
                    element.classList.add(
                        "has-focus"
                    );
                }
            );

            element.addEventListener(
                "blur",
                () => {
                    element.classList.remove(
                        "has-focus"
                    );
                }
            );
        }
    );
});


/* =========================================================
   REDUCED MOTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    if (!reducedMotion.matches) {
        return;
    }

    document.documentElement.classList.add(
        "reduced-motion"
    );
});


/* =========================================================
   GLOBAL ESCAPE HANDLER
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key !== "Escape"
        ) {
            return;
        }

        document
            .querySelectorAll(
                ".is-open"
            )
            .forEach(
                (element) => {
                    element.classList.remove(
                        "is-open"
                    );
                }
            );

        document.body.classList.remove(
            "menu-open",
            "modal-open",
            "body-scroll-locked"
        );
    }
);


/* =========================================================
   WINDOW LOAD
   ========================================================= */

window.addEventListener(
    "load",
    () => {
        document.documentElement.classList.add(
            "page-loaded"
        );
    }
);

/* =========================================================
   AURELIA HOTEL — SEARCH ENGINE INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("hotel-search-form");

    if (!form) {
        return;
    }

    const destinationInput = document.getElementById("search-destination");
    const checkInInput = document.getElementById("search-check-in");
    const checkOutInput = document.getElementById("search-check-out");
    const guestsTrigger = document.getElementById("search-guests");
    const roomsTrigger = document.getElementById("search-rooms");
    const guestsDropdown = document.getElementById("search-guests-dropdown");
    const roomsDropdown = document.getElementById("search-rooms-dropdown");
    const message = document.getElementById("search-message");

    const state = {
        checkIn: null,
        checkOut: null,
        adults: 2,
        children: 0,
        rooms: 1
    };

    let calendar = null;
    let calendarType = null;

    const pad = (value) => String(value).padStart(2, "0");

    const toISO = (date) =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    const parseISO = (value) =>
        value ? new Date(`${value}T00:00:00`) : null;

    const today = () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const formatDate = (value) => {
        const date = parseISO(value);
        if (!date || Number.isNaN(date.getTime())) {
            return "Select date";
        }
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    function closeCalendar() {
        if (calendar) {
            calendar.remove();
        }
        calendar = null;
        calendarType = null;
    }

    function closeDropdown(dropdown, trigger) {
        if (!dropdown) return;
        dropdown.classList.remove("is-open");
        dropdown.setAttribute("aria-hidden", "true");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
    }

    function closeSearchDropdowns() {
        closeDropdown(guestsDropdown, guestsTrigger);
        closeDropdown(roomsDropdown, roomsTrigger);
    }

    function updateGuestSummary() {
        const total = state.adults + state.children;
        if (guestsTrigger) {
            guestsTrigger.textContent = `${total} ${total === 1 ? "Guest" : "Guests"}`;
        }

        const adults = document.getElementById("search-adults-count");
        const children = document.getElementById("search-children-count");

        if (adults) adults.textContent = String(state.adults);
        if (children) children.textContent = String(state.children);
    }

    function updateRoomSummary() {
        if (roomsTrigger) {
            roomsTrigger.textContent = `${state.rooms} ${state.rooms === 1 ? "Room" : "Rooms"}`;
        }

        const rooms = document.getElementById("search-rooms-count");
        if (rooms) rooms.textContent = String(state.rooms);
    }

    function showMessage(text, type = "error") {
        if (!message) return;
        message.textContent = text;
        message.classList.remove("is-error", "is-success");
        message.classList.add(`is-${type}`);
    }

    function clearMessage() {
        if (!message) return;
        message.textContent = "";
        message.classList.remove("is-error", "is-success");
    }

    function createSearchCalendar(type) {
        const input = type === "checkIn" ? checkInInput : checkOutInput;
        if (!input) return;

        closeCalendar();
        closeSearchDropdowns();
        calendarType = type;

        const selected = type === "checkIn" ? state.checkIn : state.checkOut;
        let month = selected ? parseISO(selected) : today();
        month.setDate(1);

        calendar = document.createElement("div");
        calendar.className = "aurelia-search-calendar";
        calendar.setAttribute("role", "dialog");
        calendar.setAttribute("aria-label", type === "checkIn" ? "Select check-in date" : "Select check-out date");
        calendar.style.cssText = [
            "position:fixed",
            "width:320px",
            "max-width:calc(100vw - 32px)",
            "padding:18px",
            "background:#f8f6f1",
            "color:#263238",
            "border:1px solid rgba(38,50,56,.12)",
            "border-radius:8px",
            "box-shadow:0 18px 45px rgba(0,0,0,.18)",
            "z-index:2147483647",
            "font-family:var(--font-body, Arial, sans-serif)"
        ].join(";");

        calendar.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;">
                <button type="button" class="search-calendar-prev" aria-label="Previous month" style="width:34px;height:34px;border:0;background:transparent;color:#263238;font-size:24px;cursor:pointer;">‹</button>
                <strong class="search-calendar-title" style="font-size:13px;font-weight:600;letter-spacing:.04em;"></strong>
                <button type="button" class="search-calendar-next" aria-label="Next month" style="width:34px;height:34px;border:0;background:transparent;color:#263238;font-size:24px;cursor:pointer;">›</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:7px;text-align:center;font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(35,39,42,.48);">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div class="search-calendar-days" style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;"></div>
        `;

        document.body.appendChild(calendar);

        function position() {
            if (!calendar) return;
            const rect = input.getBoundingClientRect();
            const width = Math.min(320, window.innerWidth - 32);
            let left = rect.left + rect.width / 2 - width / 2;
            let top = rect.bottom + 10;
            const estimatedHeight = 360;

            left = Math.max(16, Math.min(left, window.innerWidth - width - 16));
            if (top + estimatedHeight > window.innerHeight - 16) {
                top = rect.top - estimatedHeight - 10;
            }
            top = Math.max(16, top);

            calendar.style.width = `${width}px`;
            calendar.style.left = `${left}px`;
            calendar.style.top = `${top}px`;
        }

        function render() {
            if (!calendar) return;

            const year = month.getFullYear();
            const monthIndex = month.getMonth();
            const title = calendar.querySelector(".search-calendar-title");
            const days = calendar.querySelector(".search-calendar-days");
            const minDate = type === "checkIn"
                ? today()
                : (state.checkIn ? parseISO(state.checkIn) : today());

            title.textContent = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            days.innerHTML = "";

            const firstDay = new Date(year, monthIndex, 1).getDay();
            const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

            for (let i = 0; i < firstDay; i += 1) {
                const empty = document.createElement("span");
                empty.style.height = "36px";
                days.appendChild(empty);
            }

            for (let day = 1; day <= daysInMonth; day += 1) {
                const date = new Date(year, monthIndex, day);
                date.setHours(0, 0, 0, 0);
                const value = toISO(date);
                const button = document.createElement("button");
                const disabled = type === "checkIn"
                    ? date < minDate
                    : date <= minDate;

                button.type = "button";
                button.textContent = String(day);
                button.disabled = disabled;
                button.style.cssText = [
                    "height:36px",
                    "border:0",
                    "border-radius:6px",
                    "background:transparent",
                    "color:#263238",
                    "font-family:inherit",
                    "font-size:12px",
                    "cursor:pointer",
                    "transition:background-color .16s ease,color .16s ease"
                ].join(";");

                if (disabled) {
                    button.style.opacity = ".3";
                    button.style.cursor = "default";
                }

                button.addEventListener("mouseenter", () => {
                    if (!disabled) {
                        button.style.background = "rgba(154,121,82,.10)";
                        button.style.color = "#9a7952";
                    }
                });

                button.addEventListener("mouseleave", () => {
                    button.style.background = "transparent";
                    button.style.color = "#263238";
                });

                button.addEventListener("click", () => {
                    if (disabled) return;

                    if (type === "checkIn") {
                        state.checkIn = value;
                        state.checkOut = null;
                        checkInInput.value = formatDate(value);
                        checkOutInput.value = "";
                        clearMessage();
                        closeCalendar();
                        createSearchCalendar("checkOut");
                    } else {
                        state.checkOut = value;
                        checkOutInput.value = formatDate(value);
                        clearMessage();
                        closeCalendar();
                    }
                });

                days.appendChild(button);
            }

            calendar.querySelector(".search-calendar-prev").onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                const previous = new Date(year, monthIndex - 1, 1);
                const current = today();
                current.setDate(1);
                if (type === "checkIn" && previous < current) return;
                if (type === "checkOut" && state.checkIn && previous < parseISO(state.checkIn).setDate(1)) return;
                month = previous;
                render();
                position();
            };

            calendar.querySelector(".search-calendar-next").onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                month = new Date(year, monthIndex + 1, 1);
                render();
                position();
            };
        }

        calendar.addEventListener("click", (event) => event.stopPropagation());
        render();
        position();
    }

    function openDropdown(dropdown, trigger) {
        if (!dropdown || !trigger) return;
        closeCalendar();
        closeSearchDropdowns();
        dropdown.classList.add("is-open");
        dropdown.setAttribute("aria-hidden", "false");
        trigger.setAttribute("aria-expanded", "true");
    }

    if (checkInInput) {
        checkInInput.addEventListener("click", (event) => {
            event.preventDefault();
            if (calendarType === "checkIn") closeCalendar();
            else createSearchCalendar("checkIn");
        });
    }

    if (checkOutInput) {
        checkOutInput.addEventListener("click", (event) => {
            event.preventDefault();
            if (!state.checkIn) {
                createSearchCalendar("checkIn");
                return;
            }
            if (calendarType === "checkOut") closeCalendar();
            else createSearchCalendar("checkOut");
        });
    }

    if (guestsTrigger) {
        guestsTrigger.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (guestsDropdown?.classList.contains("is-open")) closeDropdown(guestsDropdown, guestsTrigger);
            else openDropdown(guestsDropdown, guestsTrigger);
        });
    }

    if (roomsTrigger) {
        roomsTrigger.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (roomsDropdown?.classList.contains("is-open")) closeDropdown(roomsDropdown, roomsTrigger);
            else openDropdown(roomsDropdown, roomsTrigger);
        });
    }

    document.querySelectorAll(".search-dropdown [data-counter]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            const counter = button.dataset.counter;
            const action = button.dataset.action;
            if (!counter || !action) return;

            const limits = {
                adults: { min: 1, max: 12 },
                children: { min: 0, max: 8 },
                rooms: { min: 1, max: 8 }
            };

            if (!Object.prototype.hasOwnProperty.call(state, counter)) return;
            const limit = limits[counter];
            if (!limit) return;

            const delta = action === "increase" ? 1 : -1;
            state[counter] = Math.max(limit.min, Math.min(limit.max, state[counter] + delta));

            updateGuestSummary();
            updateRoomSummary();
        });
    });

    document.querySelectorAll(".search-dropdown [data-close-dropdown]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const type = button.dataset.closeDropdown;
            if (type === "guests") closeDropdown(guestsDropdown, guestsTrigger);
            if (type === "rooms") closeDropdown(roomsDropdown, roomsTrigger);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        closeCalendar();
        closeSearchDropdowns();
        clearMessage();

        if (!destinationInput?.value.trim()) {
            showMessage("Please enter a destination.");
            destinationInput?.focus();
            return;
        }

        if (!state.checkIn) {
            showMessage("Please select a check-in date.");
            createSearchCalendar("checkIn");
            return;
        }

        if (!state.checkOut) {
            showMessage("Please select a check-out date.");
            createSearchCalendar("checkOut");
            return;
        }

        if (parseISO(state.checkOut) <= parseISO(state.checkIn)) {
            showMessage("Check-out must be after check-in.");
            return;
        }

        showMessage("Your stay preferences are ready to search.", "success");
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (calendar && !calendar.contains(target) && target !== checkInInput && target !== checkOutInput) {
            closeCalendar();
        }

        if (
            guestsDropdown &&
            !guestsDropdown.contains(target) &&
            target !== guestsTrigger &&
            roomsDropdown &&
            !roomsDropdown.contains(target) &&
            target !== roomsTrigger
        ) {
            closeSearchDropdowns();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCalendar();
            closeSearchDropdowns();
        }
    });

    window.addEventListener("resize", () => {
        if (calendar) {
            const input = calendarType === "checkIn" ? checkInInput : checkOutInput;
            if (input) {
                const rect = input.getBoundingClientRect();
                const width = Math.min(320, window.innerWidth - 32);
                let left = rect.left + rect.width / 2 - width / 2;
                let top = rect.bottom + 10;
                left = Math.max(16, Math.min(left, window.innerWidth - width - 16));
                if (top + 360 > window.innerHeight - 16) top = rect.top - 370;
                top = Math.max(16, top);
                calendar.style.width = `${width}px`;
                calendar.style.left = `${left}px`;
                calendar.style.top = `${top}px`;
            }
        }
    });

    updateGuestSummary();
    updateRoomSummary();
});

/* =========================================================
   AURELIA HOTEL — FEATURED ROOMS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const featuredRoomsSection =
    document.querySelector(
      ".featured-rooms-section"
    );

  if (!featuredRoomsSection) {
    return;
  }


  /* =======================================================
     ROOM CARD INTERACTION
  ======================================================= */

  const roomCards =
    featuredRoomsSection.querySelectorAll(
      ".room-card"
    );


  roomCards.forEach((card) => {

    const imageLink =
      card.querySelector(
        ".room-card-image"
      );

    const roomLink =
      card.querySelector(
        ".room-card-link"
      );


    if (imageLink) {

      imageLink.addEventListener(
        "click",
        () => {
          card.classList.add(
            "room-card--visited"
          );
        }
      );

    }


    if (roomLink) {

      roomLink.addEventListener(
        "click",
        () => {
          card.classList.add(
            "room-card--visited"
          );
        }
      );

    }

  });


  /* =======================================================
     KEYBOARD ACCESS
  ======================================================= */

  roomCards.forEach((card) => {

    card.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {
          return;
        }

        const link =
          card.querySelector(
            ".room-card-image"
          );

        if (!link) {
          return;
        }

        event.preventDefault();

        link.click();

      }
    );

  });


});

/* =========================================================
   AURELIA HOTEL — EXPERIENCE SECTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const experienceSection =
        document.querySelector(".experience-section");

    if (!experienceSection) {
        return;
    }

    experienceSection.classList.add("is-ready");

    const experienceElements =
        experienceSection.querySelectorAll(
            ".experience-media, " +
            ".experience-content, " +
            ".experience-feature"
        );

    if (!("IntersectionObserver" in window)) {
        experienceElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    observerInstance.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -60px 0px"
            }
        );

    experienceElements.forEach((element, index) => {
        element.style.setProperty(
            "--experience-delay",
            `${Math.min(index * 90, 360)}ms`
        );

        observer.observe(element);
    });
});


/* =========================================================
   AURELIA — LOWER PAGE INTERACTIONS
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const revealItems = document.querySelectorAll(
        ".dining-section .dining-media, .dining-section .dining-content, " +
        ".why-aurelia-stat, .reviews-section .review-card, " +
        ".location-content, .location-map, .final-cta-inner, .site-footer"
    );

    if (revealItems.length) {
        if (!("IntersectionObserver" in window)) {
            revealItems.forEach((el) => el.classList.add("is-visible"));
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
            revealItems.forEach((el, index) => {
                el.style.setProperty("--lower-delay", `${Math.min(index * 70, 280)}ms`);
                revealObserver.observe(el);
            });
        }
    }

    const diningCopy = document.getElementById("dining-focus-copy");
    const diningButtons = document.querySelectorAll("[data-dining-focus]");
    const diningMessages = {
        all: "Breakfast, lunch, and dinner are served with the same quiet attention to detail.",
        private: "Private tables, tailored menus, and intimate evenings arranged around the occasion.",
        seasonal: "Menus follow the season, bringing fresh ingredients and the character of the estate to every plate."
    };
    diningButtons.forEach((button) => {
        button.addEventListener("click", () => {
            diningButtons.forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
            if (diningCopy) diningCopy.textContent = diningMessages[button.dataset.diningFocus] || diningMessages.all;
        });
    });

    const reviewCards = Array.from(document.querySelectorAll(".review-card"));
    const prevReview = document.querySelector(".reviews-arrow--prev");
    const nextReview = document.querySelector(".reviews-arrow--next");
    let activeReview = Math.max(0, reviewCards.findIndex((card) => card.classList.contains("is-active")));
    function showReview(index) {
        if (!reviewCards.length) return;
        activeReview = (index + reviewCards.length) % reviewCards.length;
        reviewCards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === activeReview));
    }
    if (prevReview) prevReview.addEventListener("click", () => showReview(activeReview - 1));
    if (nextReview) nextReview.addEventListener("click", () => showReview(activeReview + 1));

    const reviewTrack = document.querySelector(".reviews-track");
    if (reviewTrack) {
        reviewTrack.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") showReview(activeReview - 1);
            if (event.key === "ArrowRight") showReview(activeReview + 1);
        });
    }
});


