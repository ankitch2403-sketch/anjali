(function () {
  const C = window.CONFIG, $ = s => document.querySelector(s);
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("#heroNames").textContent = C.names.him.toUpperCase() + " ❤️ " + C.names.her.toUpperCase();
  $("#wishTitle").textContent = "Little Wishes for My " + C.names.nick + " 💗";
  $("#fQuote").textContent = C.final.quote; $("#fGreet").textContent = C.final.greeting;
  $("#fLetter").textContent = C.final.letter;
  C.final.promises.forEach(p => { const li = document.createElement("li"); li.textContent = p; $("#fPromises").append(li); });
  const s = new Date(C.startISO);
  if (isNaN(s)) console.warn("Invalid startISO in config.js");
  else $("#sinceTxt").textContent = "Since " + s.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  window.Counter.init(C.startISO);

  if (!calm) {
    const box = $("#petals"), n = innerWidth < 600 ? 10 : 18;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i"); p.textContent = i % 3 ? "🌸" : "♥";
      p.style.cssText = "left:" + Math.random() * 100 + "%;font-size:" + (10 + Math.random() * 14) + "px;animation-duration:" + (9 + Math.random() * 10) + "s;animation-delay:-" + Math.random() * 15 + "s";
      box.append(p);
    }
  }

  const cv = $("#fx"), cx = cv.getContext("2d"); let parts = [], run = false;
  function fit() { const r = cv.parentElement.getBoundingClientRect(); cv.width = r.width; cv.height = r.height; }
  function burst(x, y) {
    const hue = 330 + Math.random() * 40;
    for (let i = 0; i < 36; i++) { const a = Math.PI * 2 * i / 36, v = 1.5 + Math.random() * 2.5; parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, h: hue }); }
    if (!run) { run = true; requestAnimationFrame(loop); }
  }
  function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(p => p.l > 0);
    parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .03; p.l -= .014; cx.fillStyle = "hsla(" + p.h + ",90%,70%," + p.l + ")"; cx.fillRect(p.x, p.y, 2.5, 2.5); });
    if (parts.length) requestAnimationFrame(loop); else run = false;
  }
  function show(k) { fit(); for (let i = 0; i < k; i++) setTimeout(() => burst(cv.width * (.15 + Math.random() * .7), cv.height * (.1 + Math.random() * .4)), i * 450); }
  $("#celebrate").onclick = () => show(5);
  if (!calm && "IntersectionObserver" in window) {
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { show(4); o.disconnect(); } }, { threshold: .5 }).observe($("#forever"));
  }
  addEventListener("resize", fit);
})();
