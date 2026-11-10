/* Private Google Drive button. Opens the folder in a new tab; Drive enforces access. */
(function () {
  const btn = document.getElementById("driveBtn"), url = window.CONFIG.driveUrl || "";
  if (!btn) return;
  btn.href = url; btn.target = "_blank"; btn.rel = "noopener noreferrer";
  if (!url || url.includes("YOUR_FOLDER_ID")) {
    btn.addEventListener("click", e => { e.preventDefault(); window.toast("Set driveUrl in js/config.js first."); });
  }
})();
