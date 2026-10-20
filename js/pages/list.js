(function () {
  const { qs, esc, productCard, ratingOf, renderHeader, renderFooter } = window.UI;
  const cat = qs("cat");
  const q = (qs("q") || "").trim().toLowerCase();
  renderHeader(cat);
  renderFooter();

  // filters + sort are remembered per viewer
  const PREF = "shopth.listPrefs";
  let prefs = { freeShip: false, onSale: false, top: false, sort: "popular" };
  try { prefs = { ...prefs, ...(JSON.parse(localStorage.getItem(PREF)) || {}) }; } catch (e) {}
  const savePrefs = () => { try { localStorage.setItem(PREF, JSON.stringify(prefs)); } catch (e) {} };

  const catName = cat && (window.CATEGORIES.find((c) => c.id === cat) || {}).name;
  document.getElementById("list-title").textContent = q ? `ผลการค้นหา “${qs("q")}”` : catName || "สินค้าทั้งหมด";

  const sortEl = document.getElementById("sort");
  sortEl.value = prefs.sort;
  sortEl.addEventListener("change", () => { prefs.sort = sortEl.value; savePrefs(); render(); });
  document.querySelectorAll("[data-filter]").forEach((b) => {
    const k = b.dataset.filter;
    b.setAttribute("aria-pressed", String(!!prefs[k]));
    b.addEventListener("click", () => { prefs[k] = !prefs[k]; b.setAttribute("aria-pressed", String(prefs[k])); savePrefs(); render(); });
  });

  function render() {
    let items = window.PRODUCTS.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (q) {
        const c = (window.CATEGORIES.find((x) => x.id === p.category) || {}).name || "";
        if (!(p.name + " " + c + " " + p.desc).toLowerCase().includes(q)) return false;
      }
      if (prefs.freeShip && !p.freeShip) return false;
      if (prefs.onSale && !p.oldPrice) return false;
      if (prefs.top && ratingOf(p).avg < 4.7) return false;
      return true;
    });
    const by = {
      popular: (a, b) => b.sold - a.sold,
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      rating: (a, b) => ratingOf(b).avg - ratingOf(a).avg,
    }[prefs.sort];
    items = items.slice().sort(by);

    document.getElementById("list-count").textContent = `${items.length} รายการ`;
    document.getElementById("grid").innerHTML = items.length
      ? items.map(productCard).join("")
      : `<div class="card empty" style="grid-column:1/-1"><div class="h2">ไม่พบสินค้า</div><div>ลองเปลี่ยนคำค้นหาหรือปิดตัวกรอง</div><a class="btn btn-sm btn-dark" href="index.html">ดูสินค้าทั้งหมด</a></div>`;
  }
  render();
})();
