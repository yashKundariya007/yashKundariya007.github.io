/* Cookie consent + Meta Pixel for garbhamantra.com.
   The Pixel loads only after the visitor taps "Accept". Until then (or after "Decline") nothing is sent.
   Pages call gmTrack(event, params, eventId); calls made before consent wait in a queue and are
   sent if the visitor accepts on this page, or dropped if they decline.
   Never include this script on /download/ (its URL holds the buyer's personal token). */
(function () {
  var PIXEL_ID = "2303970480378834";
  var KEY = "gm_consent";            // "yes" | "no"
  var queue = [];

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadPixel() {
    if (window.fbq) return;
    /* Meta's standard base code */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
    while (queue.length) send(queue.shift());
  }

  function send(e) { e[2] ? fbq("track", e[0], e[1] || {}, { eventID: e[2] }) : fbq("track", e[0], e[1] || {}); }

  window.gmTrack = function (event, params, eventId) {
    var e = [event, params, eventId];
    if (get() === "yes" && window.fbq) send(e);
    else if (get() !== "no") queue.push(e);
  };

  var css =
    ".gm-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;max-width:560px;margin:0 auto;" +
    "background:#fff;border:1px solid #EAD7DD;border-radius:18px;box-shadow:0 18px 40px -18px rgba(78,39,68,.45);" +
    "padding:16px 18px;font-family:Poppins,system-ui,sans-serif;font-size:.86rem;line-height:1.55;color:#4A3346}" +
    ".gm-consent p{margin:0 0 12px}.gm-consent a{color:#6B3A5E}" +
    ".gm-consent .row{display:flex;gap:10px;flex-wrap:wrap}" +
    ".gm-consent button{font:inherit;font-weight:500;border-radius:999px;padding:9px 20px;cursor:pointer}" +
    ".gm-consent .ok{background:#6B3A5E;color:#fff;border:0}.gm-consent .no{background:#fff;color:#6B3A5E;border:1px solid #F2C4CE}" +
    ".gm-consent button:focus-visible{outline:3px solid #D8B57A;outline-offset:2px}";

  function banner() {
    if (document.querySelector(".gm-consent")) return;
    if (!document.getElementById("gm-consent-css")) {
      var st = document.createElement("style"); st.id = "gm-consent-css"; st.textContent = css; document.head.appendChild(st);
    }
    var d = document.createElement("div");
    d.className = "gm-consent"; d.setAttribute("role", "dialog"); d.setAttribute("aria-label", "Cookie choice");
    d.innerHTML = '<p>We\'d like to use cookies (the Meta Pixel) to see which of our Facebook and Instagram ads bring visitors and orders. ' +
      'It only runs if you allow it. <a href="/privacy/#cookies">Learn more</a></p>' +
      '<div class="row"><button type="button" class="ok">Accept</button><button type="button" class="no">Decline</button></div>';
    d.querySelector(".ok").onclick = function () { set("yes"); d.remove(); loadPixel(); };
    d.querySelector(".no").onclick = function () {
      set("no"); queue = []; d.remove();
      if (window.fbq) location.reload();   // stop a Pixel that was already running on this page
    };
    document.body.appendChild(d);
  }

  window.gmCookieSettings = function () { try { localStorage.removeItem(KEY); } catch (e) {} banner(); };

  function start() {
    var c = get();
    if (c === "yes") loadPixel();
    else if (c !== "no") banner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
