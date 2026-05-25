document.addEventListener("DOMContentLoaded", () => {
    const mobileToggle = document.querySelector(".mobile-toggle");
    const mainNav = document.querySelector(".main-nav");

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("is-open");
            mobileToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("is-open");
                mobileToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (event) => {
            const clickedInsideNav = mainNav.contains(event.target);
            const clickedToggle = mobileToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                mainNav.classList.remove("is-open");
                mobileToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    const modalTriggers = document.querySelectorAll("[data-modal-target]");
    const modals = document.querySelectorAll(".modal");
    let lastFocusedElement = null;

    const getFocusableElements = (modal) => {
        return Array.from(
            modal.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            )
        );
    };

    const openModal = (modal) => {
        if (!modal) return;

        lastFocusedElement = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        const focusableElements = getFocusableElements(modal);
        const closeButton = modal.querySelector("[data-modal-close]");

        if (closeButton) {
            closeButton.focus();
        } else if (focusableElements.length) {
            focusableElements[0].focus();
        }
    };

    const closeModal = (modal) => {
        if (!modal) return;

        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");

        const anyModalOpen = document.querySelector(".modal.is-open");
        if (!anyModalOpen) {
            document.body.classList.remove("modal-open");
        }

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
        }
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const modalId = trigger.getAttribute("data-modal-target");
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    modals.forEach((modal) => {
        const closeButtons = modal.querySelectorAll("[data-modal-close]");

        closeButtons.forEach((button) => {
            button.addEventListener("click", () => closeModal(modal));
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        const openModalEl = document.querySelector(".modal.is-open");

        if (!openModalEl) return;

        if (event.key === "Escape") {
            closeModal(openModalEl);
            return;
        }

        if (event.key !== "Tab") return;

        const focusableElements = getFocusableElements(openModalEl);
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });
});
