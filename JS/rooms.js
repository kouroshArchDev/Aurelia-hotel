/* AURELIA HOTEL — ROOMS PAGE */
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll("[data-room-card]");
    cards.forEach((card) => {
        const link = card.querySelector("a");
        if (!link) return;
        card.addEventListener("click", (event) => {
            if (event.target.closest("a,button")) return;
            link.click();
        });
    });
});
