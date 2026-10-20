(function () {
  const { esc, baht, imgBox, renderHeader, renderFooter, toast } = window.UI;
  const S = window.Store;
  renderHeader();
  renderFooter();
  const page = document.getElementById("page");
  let couponMsg = "";

  function render() {
    const t = S.totals();
    const count = S.count();
    if (!t.lines.length) {
      page.innerHTML = `<h1 class="h1">ตะกร้าของคุณ</h1>
        <div class="card empty"><div class="h2">ตะกร้ายังว่างอยู่</div><div>ไปเลือกของที่ชอบกันเลย</div><a class="btn btn-pink" href="index.html">เลือกซื้อสินค้า</a></div>`;
      return;
    }
    const left = window.SHIPPING.freeOver - t.subtotal;
    const pct = Math.min(100, Math.round((t.subtotal / window.SHIPPING.freeOver) * 100));
    page.innerHTML = `
      <h1 class="h1">ตะกร้าของคุณ <span class="tag tag-pink" style="font-size:20px;padding:4px 14px;vertical-align:middle">${count} ชิ้น</span></h1>
      <div class="split">
        <div class="main" style="display:flex;flex-direction:column;gap:18px">
          <div class="card" style="box-shadow:none;padding:16px;display:flex;flex-direction:column;gap:10px">
            <b>${left > 0 ? `ซื้อเพิ่มอีก ${baht(left)} รับส่งฟรี!` : "คุณได้รับสิทธิ์ส่งฟรีแล้ว!"}</b>
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
          </div>
          ${t.lines.map((l) => {
            const p = l.product;
            const variant = [l.color, l.size].filter(Boolean).join(" · ");
            return `<div class="card line">
              ${imgBox({ ...p, bg: (p.colors.find((c) => c.name === l.color) || {}).hex || p.bg }, "", "", 240)}
              <div style="flex:1 1 180px;min-width:0;display:flex;flex-direction:column;gap:4px">
                <a href="product.html?id=${encodeURIComponent(p.id)}" style="font-size:18px;font-weight:800">${esc(p.name)}</a>
                ${variant ? `<div style="font-size:14px">${esc(variant)}</div>` : ""}
                <div style="font-size:14px"><b>${baht(p.price)}</b> ${p.oldPrice ? `<span class="strike">${baht(p.oldPrice)}</span>` : ""}</div>
                <button type="button" data-remove="${esc(l.key)}" style="align-self:flex-start;border:0;background:none;padding:0;font-size:13px;font-weight:600;text-decoration:underline;color:var(--pink-deep)">ลบ</button>
              </div>
              <div class="stepper">
                <button type="button" data-key="${esc(l.key)}" data-d="-1" aria-label="ลดจำนวน">−</button>
                <span>${l.qty}</span>
                <button type="button" class="plus" data-key="${esc(l.key)}" data-d="1" aria-label="เพิ่มจำนวน" ${l.qty >= p.stock ? "disabled" : ""}>+</button>
              </div>
              <div class="price" style="min-width:90px;text-align:right">${baht(p.price * l.qty)}</div>
            </div>`;
          }).join("")}
          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <a href="index.html" class="chip" style="border-style:dashed;padding:10px 18px;font-weight:800">+ เลือกสินค้าเพิ่ม</a>
            <button type="button" class="chip" data-clear style="padding:10px 18px">ล้างตะกร้า</button>
          </div>
        </div>

        <aside class="side card summary" style="background:var(--blue)">
          <div class="h2" style="font-size:24px">สรุปคำสั่งซื้อ</div>
          <form id="coupon" class="field" style="font-weight:800">
            <label for="coupon-code">โค้ดส่วนลด</label>
            <div style="display:flex;gap:8px">
              <input id="coupon-code" name="code" value="${esc(S.coupon() || "")}" placeholder="เช่น SHOP50" style="flex:1;min-width:0;text-transform:uppercase">
              ${S.coupon() ? `<button type="button" class="btn btn-sm" data-uncoupon>ยกเลิก</button>` : `<button type="submit" class="btn btn-sm btn-dark">ใช้</button>`}
            </div>
            <div style="font-size:13px;font-weight:600" aria-live="polite">${esc(couponMsg || (t.code ? `ใช้โค้ด ${t.code} แล้ว` : ""))}</div>
          </form>
          <div class="row"><span>ราคาสินค้า (${count} ชิ้น)</span><b>${baht(t.subtotal)}</b></div>
          ${t.discount ? `<div class="row"><span>ส่วนลด (${esc(t.code)})</span><b>−${baht(t.discount)}</b></div>` : ""}
          <div class="row"><span>ค่าจัดส่ง (ธรรมดา)</span><b>${t.shipping ? baht(t.shipping) : "ฟรี"}</b></div>
          <div class="row total"><span>รวม</span><span>${baht(t.total)}</span></div>
          <a class="btn btn-pink" href="checkout.html" style="font-size:19px">ไปหน้าชำระเงิน →</a>
          <div style="font-size:13px;text-align:center">ชำระเงินปลอดภัย · คืนสินค้าได้ใน 7 วัน</div>
        </aside>
      </div>`;
  }

  page.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.d) {
      const line = S.cart().find((l) => l.key === b.dataset.key);
      if (line) S.setQty(line.key, line.qty + +b.dataset.d);
    } else if (b.dataset.remove) { S.remove(b.dataset.remove); toast("ลบสินค้าออกจากตะกร้าแล้ว"); }
    else if (b.hasAttribute("data-clear")) { S.clearCart(); }
    else if (b.hasAttribute("data-uncoupon")) { S.setCoupon(null); couponMsg = ""; }
    else return;
    render();
  });
  page.addEventListener("submit", (e) => {
    if (e.target.id !== "coupon") return;
    e.preventDefault();
    const code = e.target.elements["code"].value.trim().toUpperCase();
    if (window.COUPONS[code]) { S.setCoupon(code); couponMsg = `ใช้โค้ด ${code} แล้ว`; }
    else couponMsg = code ? "โค้ดไม่ถูกต้อง" : "กรุณาใส่โค้ด";
    render();
  });
  window.addEventListener("storage", render); // cart changed in another tab

  render();
})();
