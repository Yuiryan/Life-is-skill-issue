(function() {
    const SELECTOR = "button, [data-animate='button']";
    const PRESS_CLASS = "is-pressed";

    function applyKeyboardShim(el) {
        if (el.tagName === "BUTTON" || el.tagName === "INPUT") {
            return;
        }

        if (!el.hasAttribute("tabindex")) {
            el.setAttribute("tabindex", "0");
        }

        if (!el.hasAttribute("role")) {
            el.setAttribute("role", "button");
        }

        el.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                el.click();
            }
        });
    }

    function attachPressHandlers(el) {
        const start = () => el.classList.add(PRESS_CLASS);
        const end = () => el.classList.remove(PRESS_CLASS);

        el.addEventListener("pointerdown", start);
        el.addEventListener("pointerup", end);
        el.addEventListener("pointerleave", end);
        el.addEventListener("pointercancel", end);
    }

    function enhanceElement(el, index) {
        if (!(el instanceof HTMLElement) || el.dataset.motionReady === "true") {
            return;
        }

        el.dataset.motionReady = "true";
        el.classList.add("motion-element", "interactive-surface");
        el.style.setProperty("--stagger-delay", `${index * 70}ms`);

        attachPressHandlers(el);
        applyKeyboardShim(el);
    }

    function scanElements() {
        const elements = Array.from(document.querySelectorAll(SELECTOR));
        elements.forEach((el, index) => enhanceElement(el, index));
    }

    document.addEventListener("DOMContentLoaded", () => {
        scanElements();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) {
                        return;
                    }

                    if (node.matches && node.matches(SELECTOR)) {
                        enhanceElement(node, 0);
                    }

                    node.querySelectorAll?.(SELECTOR).forEach((child) => enhanceElement(child, 0));
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
