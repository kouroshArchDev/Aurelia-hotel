/* =========================================================
   AURELIA HOTEL — ROOM DETAILS
   File: js/room-details.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const rooms = {
        garden: {
            type: "Suite",
            title: "Garden Suite",
            intro: "A serene suite opening onto private gardens, with generous living space and soft natural light.",
            price: "$480",
            guests: "2",
            size: "72 m²",
            bed: "King Bed",
            view: "Private Garden",
            image: "assets/images/room-garden-suite.png",
            description: "A spacious retreat designed around natural light, quiet materials, and a private garden.",
            story: "The Garden Suite opens naturally toward a private garden, creating a calm transition between indoor comfort and the surrounding landscape. Warm timber, tactile stone, soft textiles, and carefully controlled lighting give the room a quiet sense of depth.",
            amenities: ["King Bed","Private Garden","Rain Shower","Mini Bar","Wi-Fi","In-room Dining","Smart Climate","Bath Amenities"]
        },
        deluxe: {
            type: "Room",
            title: "Deluxe Room",
            intro: "An elegant retreat balancing refined comfort, warm textures, and views across the estate.",
            price: "$320",
            guests: "2",
            size: "42 m²",
            bed: "King Bed",
            view: "Estate View",
            image: "assets/images/room-deluxe.png",
            description: "A refined room with warm materials, generous daylight, and a calm view across the Aurelia estate.",
            story: "The Deluxe Room brings together soft natural textures, balanced proportions, and warm evening light. It is designed as an effortless retreat after a day spent exploring the gardens, dining room, and surrounding landscape.",
            amenities: ["King Bed","Estate View","Rain Shower","Mini Bar","Wi-Fi","In-room Dining","Smart Climate","Bath Amenities"]
        },
        terrace: {
            type: "Room",
            title: "Terrace Room",
            intro: "A light-filled room with a private terrace, designed for slow mornings and quiet evenings.",
            price: "$390",
            guests: "2",
            size: "50 m²",
            bed: "King Bed",
            view: "Private Terrace",
            image: "assets/images/room-terrace.png",
            description: "A bright retreat extending toward a private terrace, with an easy connection to the outdoors.",
            story: "The Terrace Room is shaped around daylight and the quiet pleasure of stepping outside. Natural stone, soft upholstery, deep green accents, and a private terrace create a relaxed rhythm between the room and the surrounding estate.",
            amenities: ["King Bed","Private Terrace","Rain Shower","Mini Bar","Wi-Fi","In-room Dining","Smart Climate","Bath Amenities"]
        }
    };

    const $ = (id) => document.getElementById(id);

    const mainImage = $("room-main-image");
    const galleryLabel = $("room-gallery-label");
    const lightbox = $("room-lightbox");
    const lightboxImage = $("room-lightbox-image");

    function renderAmenities(items) {
        const list = $("room-amenities-list");
        if (!list) return;
        list.innerHTML = "";
        items.forEach((item, index) => {
            const el = document.createElement("div");
            el.className = "room-amenity";
            el.innerHTML =
                `<span>${String(index + 1).padStart(2,"0")}</span>` +
                `<strong>${item}</strong>`;
            list.appendChild(el);
        });
    }

    function setActiveRoom(key, updateUrl = true) {
        const room = rooms[key] || rooms.garden;

        $("room-eyebrow").textContent = room.type;
        $("room-title").textContent = room.title;
        $("room-intro").textContent = room.intro;
        $("room-price").textContent = room.price;
        $("room-breadcrumb-current").textContent = room.title;

        $("room-summary-title").textContent = room.title;
        $("room-summary-description").textContent = room.description;
        $("room-guests").textContent = room.guests;
        $("room-size").textContent = room.size;
        $("room-bed").textContent = room.bed;
        $("room-view").textContent = room.view;

        $("room-story-title").innerHTML =
            `Designed for <span>${key === "terrace" ? "open air." : key === "deluxe" ? "quiet luxury." : "unhurried living."}</span>`;

        $("room-story-text").textContent = room.story;

        if (mainImage) {
            mainImage.style.opacity = "0.35";
            window.setTimeout(() => {
                mainImage.src = room.image;
                mainImage.alt = `Aurelia ${room.title}`;
                mainImage.style.opacity = "1";
            }, 120);
        }

        if (galleryLabel) galleryLabel.textContent = room.title;

        renderAmenities(room.amenities);

        document.querySelectorAll(".room-switcher-item").forEach((button) => {
            const active = button.dataset.room === key;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-selected", String(active));
        });

        document.querySelectorAll(".room-gallery-thumb").forEach((button, index) => {
            button.classList.toggle("is-active", index === 0);
        });

        if (updateUrl) {
            history.replaceState(null, "", `room-details.html?room=${key}`);
        }
    }

    document.querySelectorAll(".room-switcher-item").forEach((button) => {
        button.addEventListener("click", () => {
            const key = button.dataset.room;
            if (!rooms[key]) return;
            setActiveRoom(key);

            document.querySelector(".room-details-main")?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    document.querySelectorAll(".room-gallery-thumb").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".room-gallery-thumb").forEach((item) => {
                item.classList.remove("is-active");
            });
            button.classList.add("is-active");

            const image = button.dataset.image;
            const placeholder = button.dataset.placeholder;

            if (image && mainImage) {
                mainImage.style.opacity = "0.35";
                window.setTimeout(() => {
                    mainImage.src = image;
                    mainImage.alt = button.dataset.alt || "Aurelia room";
                    mainImage.style.opacity = "1";
                }, 120);
                if (galleryLabel) galleryLabel.textContent = button.dataset.alt || "Aurelia Room";
            } else if (placeholder && galleryLabel) {
                galleryLabel.textContent = `${placeholder} · Image coming soon`;
            }
        });
    });

    function openLightbox() {
        if (!lightbox || !mainImage || !lightboxImage) return;
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("body-scroll-locked");
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("body-scroll-locked");
    }

    $("room-gallery-expand")?.addEventListener("click", openLightbox);
    $("room-lightbox-close")?.addEventListener("click", closeLightbox);

    lightbox?.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeLightbox();
    });

    const requested = new URLSearchParams(window.location.search).get("room");
    setActiveRoom(rooms[requested] ? requested : "garden", false);
});
