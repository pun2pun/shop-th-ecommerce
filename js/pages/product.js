(function () {
  const { qs, esc, baht, compact, product, ratingOf, starStr, imgBox, productCard, discountPct, renderHeader, renderFooter, toast } = window.UI;
  const S = window.Store;
  const p = product(qs("id")) || window.PRODUCTS[0];
  renderHeader(p.category);
  renderFooter();
  document.title = `SHOP.th — ${p.name}`;

  const firstSize = p.sizes.find((s) => !p.soldOutSizes.includes(s)) || null;
  const st = { color: 0, size: firstSize, qty: 1, starFilter: 0, newRating: 0, sizeError: false };
  const page = document.getElementById("page");
  const catName = (window.CATEGORIES.find((c) => c.id === p.category) || {}).name;

  function allReviews() {
    const seeded = p.reviews.map((r, i) => ({ ...r, id: `${p.id}-s${i}` }));
    return [...S.reviews(p.id), ...seeded];
  }
  const fmtDate = (d) => new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  const avatarColors = ["#FF4F8B", "#5BD1F5", "#9EE37D", "#FFD60A", "#C9A7FF", "#FF8A3D"];

  function render() {
    const r = ratingOf(p);
    const pct = discountPct(p);
    const color = p.colors[st.color];
    const helpful = S.helpful();
    const reviews = allReviews().filter((x) => !st.starFilter || x.rating === st.starFilter);
    const related = window.PRODUCTS.filter((x) => x.id !== p.id).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 4);

    page.innerHTML = `
    <nav aria-label="breadcrumb" style="display:flex;gap:8px;flex-wrap:wrap;font-size:14px">
      <a href="index.html" style="font-weight:600;text-decoration:underline">หน้าแรก</a><span>/</span>
      <a href="index.html?cat=${p.category}" style="font-weight:600;text-decoration:underline">${esc(catName)}</a><span>/</span><span>${esc(p.name)}</span>
    </nav>

    <div class="split" style="gap:36px">
      <div style="flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:14px">
        <div class="img card" style="height:480px;border-width:3px;border-radius:24px;background:${color.hex}">
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">` : `รูปสินค้า · ${esc(color.name)}`}
          ${pct ? `<span class="badge" style="top:16px;left:16px;font-size:16px;padding:4px 12px">-${pct}%</span>` : ""}
        </div>
        <div class="thumbs">${p.colors.map((c, i) => `<button type="button" data-color="${i}" aria-label="ดูสี${esc(c.name)}" aria-pressed="${i === st.color}" style="background:${c.hex}"></button>`).join("")}</div>
      </div>

      <div style="flex:1 1 380px;min-width:0;display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${p.sold >= 3000 ? `<span class="tag tag-yellow">ขายดี</span>` : ""}
          ${p.freeShip ? `<span class="tag tag-green">ส่งฟรี</span>` : ""}
        </div>
        <h1 class="h1" style="font-size:38px">${esc(p.name)}</h1>
        <a href="#reviews" style="display:flex;align-items:center;gap:8px;font-size:15px;flex-wrap:wrap">
          <span class="stars" style="font-size:20px">${starStr(r.avg)}</span><b>${r.avg.toFixed(1)}</b>
          <span style="text-decoration:underline">${r.count.toLocaleString()} รีวิว</span><span>· ขายแล้ว ${compact(p.sold)}</span>
        </a>
        <div style="display:flex;align-items:baseline;gap:12px;background:#fff;border:2px solid var(--ink);border-radius:16px;padding:14px 18px;flex-wrap:wrap">
          <span style="font-size:38px;font-weight:800;color:var(--pink-deep)">${baht(p.price)}</span>
          ${p.oldPrice ? `<span class="strike" style="font-size:18px">${baht(p.oldPrice)}</span><span class="tag tag-pink">ประหยัด ${baht(p.oldPrice - p.price)}</span>` : ""}
        </div>

        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="font-weight:800">สี: ${esc(color.name)}</div>
          <div style="display:flex;gap:12px">${p.colors.map((c, i) => `<button type="button" class="swatch" data-color="${i}" aria-label="${esc(c.name)}" aria-pressed="${i === st.color}" style="background:${c.hex}"></button>`).join("")}</div>
        </div>

        ${p.sizes.length ? `<div style="display:flex;flex-direction:column;gap:8px">
          <div class="row"><span style="font-weight:800">ไซซ์: ${esc(st.size || "-")}</span><a href="#spec" style="text-decoration:underline;font-weight:600">ตารางไซซ์</a></div>
          <div style="display:flex;gap:10px;flex-wrap:wrap">${p.sizes.map((s) => `<button type="button" class="size" data-size="${esc(s)}" aria-pressed="${s === st.size}" ${p.soldOutSizes.includes(s) ? "disabled" : ""}>${esc(s)}</button>`).join("")}</div>
          ${st.sizeError ? `<div style="color:var(--pink-deep);font-weight:600;font-size:14px">กรุณาเลือกไซซ์</div>` : ""}
        </div>` : ""}

        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
          <div class="stepper">
            <button type="button" data-qty="-1" aria-label="ลดจำนวน" ${st.qty <= 1 ? "disabled" : ""}>−</button>
            <span aria-live="polite">${st.qty}</span>
            <button type="button" class="plus" data-qty="1" aria-label="เพิ่มจำนวน" ${st.qty >= p.stock ? "disabled" : ""}>+</button>
          </div>
          <span style="font-size:14px">${p.stock <= 5 ? `<b style="color:var(--pink-deep)">เหลือเพียง ${p.stock} ชิ้น</b>` : `มีสินค้า ${p.stock} ชิ้น`}</span>
        </div>

        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button type="button" class="btn btn-pink" data-action="add" style="flex:1 1 200px;font-size:19px">เพิ่มลงตะกร้า</button>
          <button type="button" class="btn btn-dark" data-action="buy" style="flex:1 1 160px;font-size:19px">ซื้อเลย</button>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;background:#fff;border:2px solid var(--ink);border-radius:16px;padding:16px;font-size:14px">
          <div class="row"><b>จัดส่ง</b><span>ได้รับภายใน 2-3 วัน · ส่งฟรีเมื่อครบ ${baht(window.SHIPPING.freeOver)}</span></div>
          <div class="row" style="border-top:2px dashed #E0D6BC;padding-top:10px"><b>คืนสินค้า</b><span>คืนได้ภายใน 7 วัน</span></div>
          <div class="row" style="border-top:2px dashed #E0D6BC;padding-top:10px"><b>ชำระเงิน</b><span>PromptPay · บัตร · เก็บเงินปลายทาง</span></div>
        </div>
      </div>
    </div>

    <section id="spec" class="card" style="display:flex;flex-direction:column;gap:16px;padding:28px;border-radius:24px">
      <h2 class="h2">รายละเอียดสินค้า</h2>
      <div style="font-size:16px;line-height:1.75">${esc(p.desc)}</div>
      <div class="spec">${p.specs.map(([k, v]) => `<div>${esc(k)}</div><div>${esc(v)}</div>`).join("")}</div>
    </section>

    <section id="reviews" style="display:flex;flex-direction:column;gap:20px">
      <h2 class="h2" style="font-size:30px">รีวิวจากลูกค้า</h2>
      <div class="card" style="display:flex;flex-wrap:wrap;gap:24px;background:var(--yellow);padding:24px;border-radius:24px">
        <div style="flex:0 1 200px;display:flex;flex-direction:column;gap:4px">
          <div style="font-size:56px;font-weight:800;line-height:1">${r.avg.toFixed(1)}<span style="font-size:22px"> / 5</span></div>
          <div style="font-size:24px;letter-spacing:2px">${starStr(r.avg)}</div>
          <div style="font-size:14px">จาก ${r.count.toLocaleString()} รีวิว</div>
        </div>
        <div style="flex:1 1 300px;display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600">
          ${r.dist.map((n, i) => { const pc = r.count ? Math.round((n / r.count) * 100) : 0; return `<button type="button" data-star="${5 - i}" style="display:flex;align-items:center;gap:10px;border:0;background:none;padding:0;font-weight:600" aria-label="กรองรีวิว ${5 - i} ดาว"><span style="width:36px;text-align:left">${5 - i} ★</span><span class="bar"><i style="width:${pc}%"></i></span><span style="width:40px;text-align:right">${pc}%</span></button>`; }).join("")}
        </div>
        <div style="flex:0 1 220px;display:flex;flex-direction:column;justify-content:center;gap:10px">
          <div style="font-weight:600">ซื้อแล้ว? บอกเพื่อน ๆ หน่อย</div>
          <a class="btn btn-dark btn-sm" href="#write-review">เขียนรีวิว</a>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${[0, 5, 4, 3, 2, 1].map((s) => `<button type="button" class="chip" data-star="${s}" aria-pressed="${st.starFilter === s}">${s ? s + " ดาว" : "ทั้งหมด"}</button>`).join("")}
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        ${reviews.length ? reviews.map((rv, i) => `
          <article class="card review">
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <div class="avatar" style="background:${avatarColors[i % avatarColors.length]}">${esc(rv.name.charAt(0))}</div>
              <div style="display:flex;flex-direction:column"><b>${esc(rv.name)}</b><span style="font-size:13px">${fmtDate(rv.date)}${rv.variant ? " · " + esc(rv.variant) : ""}</span></div>
              ${rv.mine ? `<span class="tag tag-yellow" style="margin-left:auto">รีวิวของคุณ</span>` : `<span class="tag tag-green" style="margin-left:auto">ซื้อแล้ว</span>`}
            </div>
            <div class="stars" style="font-size:18px;letter-spacing:2px">${starStr(rv.rating)}</div>
            <div style="font-size:15px;line-height:1.7;white-space:pre-line">${esc(rv.text)}</div>
            <button type="button" class="chip" data-helpful="${esc(rv.id)}" aria-pressed="${!!helpful[rv.id]}" style="align-self:flex-start;font-size:13px">เป็นประโยชน์ (${(rv.helpful || 0) + (helpful[rv.id] ? 1 : 0)})</button>
          </article>`).join("") : `<div class="card empty" style="box-shadow:none">ยังไม่มีรีวิว ${st.starFilter} ดาว</div>`}
      </div>

      <form id="write-review" class="card" style="display:flex;flex-direction:column;gap:14px;padding:24px;border-radius:24px" novalidate>
        <h3 class="h2" style="font-size:22px">เขียนรีวิว</h3>
        <div class="field"><span>ให้คะแนน</span>
          <div class="star-input" role="radiogroup" aria-label="ให้คะแนน">
            ${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="${st.newRating === n}" aria-label="${n} ดาว" data-rate="${n}" class="${n <= st.newRating ? "on" : ""}">★</button>`).join("")}
          </div>
        </div>
        <label class="field">ชื่อที่แสดง<input name="name" maxlength="40" required placeholder="เช่น มิ้นท์ ส."></label>
        <label class="field">รีวิว<textarea name="text" rows="4" maxlength="500" required placeholder="สินค้าเป็นยังไงบ้าง?"></textarea></label>
        <div id="review-err" style="color:var(--pink-deep);font-weight:600;font-size:14px"></div>
        <button type="submit" class="btn btn-pink" style="align-self:flex-start">ส่งรีวิว</button>
      </form>
    </section>

    <section style="display:flex;flex-direction:column;gap:16px">
      <h2 class="h2">สินค้าที่คุณอาจชอบ</h2>
      <div class="grid">${related.map(productCard).join("")}</div>
    </section>`;
  }

  // Keep typed review text across re-renders.
  function withForm(fn) {
    const f = document.getElementById("write-review");
    const saved = f ? { name: f.elements["name"].value, text: f.elements["text"].value } : null;
    fn();
    const g = document.getElementById("write-review");
    if (saved && g) { g.elements["name"].value = saved.name; g.elements["text"].value = saved.text; }
  }

  page.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.color != null) { st.color = +b.dataset.color; withForm(render); }
    else if (b.dataset.size != null) { st.size = b.dataset.size; st.sizeError = false; withForm(render); }
    else if (b.dataset.qty) { st.qty = Math.min(p.stock, Math.max(1, st.qty + +b.dataset.qty)); withForm(render); }
    else if (b.dataset.star != null) { st.starFilter = +b.dataset.star; withForm(render); }
    else if (b.dataset.rate) { st.newRating = +b.dataset.rate; withForm(render); }
    else if (b.dataset.helpful) { S.toggleHelpful(b.dataset.helpful); withForm(render); }
    else if (b.dataset.action) {
      if (p.sizes.length && !st.size) { st.sizeError = true; withForm(render); return; }
      S.add(p.id, p.colors[st.color].name, st.size, st.qty);
      if (b.dataset.action === "buy") { location.href = "checkout.html"; return; }
      toast(`เพิ่ม ${p.name} × ${st.qty} ลงตะกร้าแล้ว`);
      st.qty = 1; withForm(render);
    }
  });

  page.addEventListener("submit", (e) => {
    if (e.target.id !== "write-review") return;
    e.preventDefault();
    const f = e.target;
    const name = f.elements["name"].value.trim(), text = f.elements["text"].value.trim();
    const err = !st.newRating ? "กรุณาให้คะแนนดาว" : !name ? "กรุณาใส่ชื่อ" : text.length < 5 ? "เขียนรีวิวอย่างน้อย 5 ตัวอักษร" : "";
    if (err) { document.getElementById("review-err").textContent = err; return; }
    S.addReview(p.id, {
      id: `${p.id}-u${Date.now()}`, name, text, rating: st.newRating, mine: true, helpful: 0,
      date: new Date().toISOString().slice(0, 10), variant: [p.colors[st.color].name, st.size].filter(Boolean).join(" / "),
    });
    st.newRating = 0; st.starFilter = 0;
    render();
    toast("ขอบคุณสำหรับรีวิว!");
    document.getElementById("reviews").scrollIntoView({ behavior: "smooth" });
  });

  render();
})();
