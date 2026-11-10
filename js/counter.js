/* Calendar-accurate duration in Asia/Kolkata (UTC+5:30, no DST). */
(function (g) {
  const OFF = 330 * 60000;
  const P = ms => { const d = new Date(ms + OFF); return [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]; };
  function diff(startMs, nowMs) {
    if (!isFinite(startMs) || !isFinite(nowMs) || nowMs < startMs) return null;
    const a = P(startMs), b = P(nowMs);
    let [y, mo, d, h, mi, s] = b.map((v, i) => v - a[i]);
    if (s < 0) { s += 60; mi--; } if (mi < 0) { mi += 60; h--; } if (h < 0) { h += 24; d--; }
    if (d < 0) { d += new Date(Date.UTC(b[0], b[1], 0)).getUTCDate(); mo--; }
    if (mo < 0) { mo += 12; y--; }
    return { y, mo, d, h, mi, s };
  }
  function init(startISO) {
    const start = Date.parse(startISO), els = {};
    document.querySelectorAll("[data-unit]").forEach(e => els[e.dataset.unit] = e);
    const badge = document.getElementById("milestone");
    function tick() {
      const r = diff(start, Date.now());
      if (!r) { Object.values(els).forEach(e => e.textContent = "--"); if (badge) badge.textContent = "Our story is about to begin"; return; }
      for (const k in r) if (els[k]) els[k].textContent = String(r[k]).padStart(2, "0");
      if (badge) badge.textContent = r.y > 0 ? r.y + (r.y === 1 ? " year" : " years") + " together" + (r.mo ? " and " + r.mo + (r.mo === 1 ? " month" : " months") : "") : r.mo + (r.mo === 1 ? " month" : " months") + " together";
    }
    tick(); setInterval(tick, 1000);
  }
  g.Counter = { diff, init };
})(typeof window !== "undefined" ? window : globalThis);
