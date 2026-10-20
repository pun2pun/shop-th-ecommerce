// Shared helpers + header/footer rendering.
(function () {
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const baht = (n) => "฿" + Number(n).toLocaleString("en-US");
  const compact = (n) => (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n));
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const product = (id) => window.PRODUCTS.find((p) => p.id === id);

  function ratingOf(p) {
    const dist = p.ratingDist.slice();
    window.Store.reviews(p.id).forEach((r) => { dist[5 - r.rating] += 1; });
    const count = dist.reduce((a, b) => a + b, 0);
    const sum = dist.reduce((a, n, i) => a + n * (5 - i), 0);
    return { avg: count ? sum / count : 0, count, dist };
  }
  const starStr = (avg) => { const full = Math.round(avg); return "★".repeat(full) + "☆".repeat(5 - full); };

  // Photo over a coloured box; if the photo fails to load, the box + label stays.
  function photo(p, w) {
    if (!p.image) return "";
    const src = w ? p.image.replace(/([?&])w=\d+/, `$1w=${w}`) : p.image;
    return `<img src="${esc(src)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">`;
  }
  function imgBox(p, cls, extra, w) {
    return `<div class="img ${cls || ""}" style="background:${p.bg}"><span>รูปสินค้า</span>${photo(p, w)}${extra || ""}</div>`;
  }
  const discountPct = (p) => (p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

  function productCard(p) {
    const r = ratingOf(p);
    const pct = discountPct(p);
    const tag = p.stock <= 5 ? `<span class="tag" style="background:var(--cream)">เหลือ ${p.stock} ชิ้น</span>`
      : p.freeShip ? `<span class="tag tag-green">ส่งฟรี</span>` : "<span></span>";
    return `<a class="card p-card" href="product.html?id=${encodeURIComponent(p.id)}">
      ${imgBox(p, "", pct ? `<span class="badge">-${pct}%</span>` : "", 500)}
      <div class="p-name">${esc(p.name)}</div>
      <div style="display:flex;align-items:center;gap:6px;font-size:14px"><span class="stars">${starStr(r.avg)}</span><b>${r.avg.toFixed(1)}</b><span>(${r.count.toLocaleString()})</span></div>
      <div style="display:flex;align-items:baseline;gap:8px"><span class="price">${baht(p.price)}</span>${p.oldPrice ? `<span class="strike" style="font-size:14px">${baht(p.oldPrice)}</span>` : ""}</div>
      <div class="row" style="align-items:center;font-size:13px">${tag}<span>ขายแล้ว ${compact(p.sold)}</span></div>
    </a>`;
  }

  function renderHeader(active) {
    const el = document.getElementById("site-header");
    if (!el) return;
    const cats = window.CATEGORIES.map((c) => `<a href="index.html?cat=${c.id}" class="${active === c.id ? "active" : ""}">${esc(c.name)}</a>`).join("");
    el.innerHTML = `
      <div class="promo">ส่งฟรีเมื่อซื้อครบ ${baht(window.SHIPPING.freeOver)} · ใช้โค้ด SHOP50 ลดเพิ่ม ฿50</div>
      <header class="site-header"><div class="wrap">
        <a class="logo" href="index.html">SHOP<span>.th</span></a>
        <form class="search" action="index.html" role="search">
          <input type="search" name="q" aria-label="ค้นหาสินค้า" placeholder="ค้นหาสินค้า หรือหมวดหมู่" value="${esc(qs("q") || "")}">
          <button type="submit">ค้นหา</button>
        </form>
        <a class="cart-link" href="cart.html">ตะกร้า · <span data-cart-count>0</span></a>
      </div></header>
      <nav class="cat-bar" aria-label="หมวดหมู่"><div class="wrap">
        <a href="index.html" class="${!active ? "active" : ""}">ทั้งหมด</a>${cats}
      </div></nav>`;
    updateCount();
  }
  function updateCount() {
    document.querySelectorAll("[data-cart-count]").forEach((n) => (n.textContent = window.Store.count()));
  }
  window.addEventListener("store:change", updateCount);
  window.addEventListener("storage", updateCount); // other tabs

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `<footer class="site"><div class="wrap">
      <div class="col" style="flex:1 1 240px"><div style="font-size:24px;font-weight:800;color:var(--yellow)">SHOP.th</div><div>[ที่อยู่ร้าน / ข้อมูลบริษัท]</div></div>
      <div class="col"><h3>ช่วยเหลือ</h3><span>วิธีสั่งซื้อ</span><span>การจัดส่ง</span><span>คืนสินค้า</span></div>
      <div class="col"><h3>ติดต่อเรา</h3><span>[เบอร์โทร]</span><span>[LINE OA]</span><span>[อีเมล]</span></div>
    </div></footer>`;
  }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  window.UI = { esc, baht, compact, qs, product, ratingOf, starStr, imgBox, photo, productCard, discountPct, renderHeader, renderFooter, toast };
})();
