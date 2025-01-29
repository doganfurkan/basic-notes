if (localStorage.getItem("prefferedLanguage") === null) {
  localStorage.setItem("prefferedLanguage", "default");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-i18n]").forEach(async (el) => {
    const messageKey = el.getAttribute("data-i18n");
    var localizedText = await localize(messageKey);
    console.log(localizedText);
    if (localizedText) {
      if (el.hasAttribute("placeholder")) {
        el.setAttribute("placeholder", localizedText);
      } else {
        el.innerText = localizedText;
      }
    }
  });
});

async function localize(messageKey) {
  var localized;
  console.log("here");
  if (localStorage.getItem("prefferedLanguage") === "default") {
    localized = chrome.i18n.getMessage(messageKey);
  } else {
    await fetch(
      chrome.runtime.getURL(
        `_locales/${localStorage.getItem("prefferedLanguage")}/messages.json`
      )
    )
      .then((response) => response.json())
      .then((messages) => {
        localized = messages[messageKey].message;
      });
  }
  console.log(localized);
  return localized;
}
