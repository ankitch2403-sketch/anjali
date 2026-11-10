(function () {
  const C = window.CONFIG, $ = s => document.querySelector(s), OFF = 330 * 60000;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  window.toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600); };

  C.wishes.forEach(w => $("#wishList").append(el("div", "card glass", w)));

  C.promises.forEach(p => {
    const b = el("button", "card glass promise"); b.setAttribute("aria-expanded", "false");
    b.append(el("strong", null, p.t), el("p", "more", p.d));
    b.onclick = () => b.setAttribute("aria-expanded", b.classList.toggle("open"));
    $("#promiseList").append(b);
  });

  const seen = new Set(), cells = [], total = C.reasons.length;
  const upd = () => { $("#rCount").textContent = seen.size + " revealed · " + (total - seen.size) + " remaining"; };
  function show(i) {
    seen.add(i); cells[i].classList.add("on");
    const p = $("#reasonShow"); p.textContent = C.reasons[i]; p.classList.remove("pop"); void p.offsetWidth; p.classList.add("pop"); upd();
  }
  C.reasons.forEach((_, i) => { const b = el("button", "num", i + 1); b.setAttribute("aria-label", "Reveal reason " + (i + 1)); b.onclick = () => show(i); cells.push(b); $("#reasonGrid").append(b); });
  $("#rRandom").onclick = () => { const left = [...Array(total).keys()].filter(i => !seen.has(i)); if (!left.length) return window.toast("All reasons revealed ❤️"); show(left[Math.floor(Math.random() * left.length)]); };
  $("#rAll").onclick = () => { const ol = $("#reasonAll"); ol.innerHTML = ""; C.reasons.forEach((r, i) => { seen.add(i); cells[i].classList.add("on"); ol.append(el("li", null, r)); }); upd(); };
  upd();

  const t0 = new Date(Date.now() + OFF), today = Date.UTC(t0.getUTCFullYear(), t0.getUTCMonth(), t0.getUTCDate());
  C.dates.forEach(d => {
    const c = el("li", "card glass"); c.append(el("strong", null, d.label));
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d.date || "");
    if (!m) { c.append(el("span", "muted", d.note || "Add a date in config.js")); $("#dateList").append(c); return; }
    const y = +m[1], mo = +m[2] - 1, dy = +m[3]; let tgt = Date.UTC(y, mo, dy), line = "";
    if (d.yearly) {
      let yr = t0.getUTCFullYear(); tgt = Date.UTC(yr, mo, dy); if (tgt < today) tgt = Date.UTC(++yr, mo, dy);
      const n = yr - y; line = n > 0 ? "Anniversary " + n + " · " : "";
    }
    const days = Math.round((tgt - today) / 864e5);
    c.append(el("span", "muted", new Date(Date.UTC(y, mo, dy)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })));
    c.append(el("span", "count", days < 0 ? "Past" : days === 0 ? "Today! 🎉" : line + days + " days to go"));
    $("#dateList").append(c);
  });

  const KEY = "af_bucket_v1"; let done = {};
  try { done = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { done = {}; }
  function prog() { const n = C.bucket.filter(b => done[b]).length; $("#bProg").style.width = (C.bucket.length ? n / C.bucket.length * 100 : 0) + "%"; $("#bTxt").textContent = n + " of " + C.bucket.length + " completed"; }
  C.bucket.forEach(b => {
    const l = el("label", "card glass check"), cb = el("input"); cb.type = "checkbox"; cb.checked = !!done[b];
    cb.onchange = () => { done[b] = cb.checked; try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) { window.toast("Could not save on this browser."); } prog(); };
    l.append(cb, el("span", null, b)); $("#bucketList").append(l);
  });
  prog();

  C.letters.forEach(L => {
    const b = el("button", "env glass"); b.setAttribute("aria-expanded", "false");
    b.append(el("span", "flap", "💌"), el("strong", null, L.t), el("p", "more", L.m));
    b.onclick = () => b.setAttribute("aria-expanded", b.classList.toggle("open"));
    $("#letterList").append(b);
  });

  const a = $("#audio"), pb = $("#play"), st = $("#mStatus"), vol = $("#vol"), mu = $("#mute");
  a.src = C.musicPath; a.volume = +vol.value;
  a.addEventListener("error", () => { st.textContent = "Add your song at " + C.musicPath + " to play it here."; pb.disabled = true; });
  a.addEventListener("playing", () => { st.textContent = "Playing ♪"; pb.textContent = "⏸ Pause"; });
  a.addEventListener("pause", () => { st.textContent = "Paused"; pb.textContent = "▶ Play"; });
  a.addEventListener("ended", () => { st.textContent = "Finished"; pb.textContent = "▶ Play"; });
  pb.onclick = () => a.paused ? a.play().catch(() => { st.textContent = "Could not play this file."; }) : a.pause();
  vol.oninput = () => { a.volume = +vol.value; a.muted = false; mu.textContent = "🔊 Mute"; };
  mu.onclick = () => { a.muted = !a.muted; mu.textContent = a.muted ? "🔇 Unmute" : "🔊 Mute"; };
})();
