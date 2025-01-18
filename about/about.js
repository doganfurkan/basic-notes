document.getElementById("copyEmail").addEventListener("click", copyEmail);

document.getElementById("version").textContent = "v" + chrome.runtime.getManifest().version;

function copyEmail() {
  const email = "devfurk@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    alert("Email copied to clipboard");
  });
}