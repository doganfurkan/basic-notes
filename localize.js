document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const messageKey = el.getAttribute("data-i18n");
        const localizedText = chrome.i18n.getMessage(messageKey);
        if (localizedText) {
            if (el.hasAttribute("placeholder")) {
                el.setAttribute("placeholder", localizedText);
            } else {
                el.innerText = localizedText;
            }
        }
    });
});
