(function () {
  const { esc, baht, qs, renderFooter } = window.UI;
  const S = window.Store;
  renderFooter();
  const page = document.getElementById("page");

  const PROVINCES = {
    "กรุงเทพมหานคร": ["จตุจักร", "บางรัก", "ปทุมวัน", "ลาดพร้าว", "วัฒนา", "ห้วยขวาง"],
    "นนทบุรี": ["เมืองนนทบุรี", "ปากเกร็ด", "บางบัวทอง"],
    "ปทุมธานี": ["เมืองปทุมธานี", "ธัญบุรี", "ลำลูกกา"],
    "เชียงใหม่": ["เมืองเชียงใหม่", "หางดง", "สันทราย"],
    "ขอนแก่น": ["เมืองขอนแก่น", "บ้านไผ่"],
    "ภูเก็ต": ["เมืองภูเก็ต", "กะทู้", "ถลาง"],
  };
  const PAYMENTS = [
    { id: "promptpay", name: "PromptPay (สแกน QR)", note: "แนะนำ" },
    { id: "card", name: "บัตรเครดิต / เดบิต", note: "Visa · Mastercard · JCB" },
    { id: "bank", name: "โอนผ่านแอปธนาคาร", note: "" },
    { id: "cod", name: "เก็บเงินปลายทาง", note: "+" + baht(window.SHIPPING.codFee) },
  ];
  const d = { ship: "standard", pay: "promptpay", ...S.draft() };
  let errors = {};

  function steps(done) {
    return `<div class="steps"><a href="cart.html" class="done" style="padding:6px 16px;border:2px solid var(--ink);border-radius:999px;background:var(--green)">1 ตะกร้า ✓</a>—<span class="${done ? "done" : "now"}">2 จัดส่ง & ชำระเงิน${done ? " ✓" : ""}</span>—<span class="${done ? "now" : ""}">3 เสร็จสิ้น</span></div>`;
  }

  function field(name, label, attrs, flex) {
    return `<label class="field ${errors[name] ? "invalid" : ""}" ${flex ? `style="flex:${flex}"` : ""}>${label}
      <input name="${name}" value="${esc(d[name] || "")}" ${attrs || ""} aria-invalid="${!!errors[name]}">
      ${errors[name] ? `<span class="err">${errors[name]}</span>` : ""}</label>`;
  }

  function renderSuccess(order) {
    page.innerHTML = `${steps(true)}
      <div class="card empty" style="background:var(--green);border-radius:24px;padding:48px 24px">
        <div class="h1">สั่งซื้อสำเร็จ!</div>
        <div style="font-size:18px">หมายเลขคำสั่งซื้อ <b>${esc(order.id)}</b></div>
        <div>ยอดชำระ <b>${baht(order.total)}</b> · ${esc(order.payName)}</div>
        <div>จัดส่งถึง ${esc(order.customer.name)} · ${esc(order.customer.district)}, ${esc(order.customer.province)}</div>
        <a class="btn btn-dark" href="index.html">ช้อปต่อ</a>
      </div>`;
  }

  function render() {
    const t = S.totals({ ship: d.ship, pay: d.pay });
    if (!t.lines.length) {
      page.innerHTML = `${steps(false)}<div class="card empty"><div class="h2">ยังไม่มีสินค้าในตะกร้า</div><a class="btn btn-pink" href="index.html">เลือกซื้อสินค้า</a></div>`;
      return;
    }
    const districts = PROVINCES[d.province] || [];
    page.innerHTML = `${steps(false)}
      <a href="cart.html" class="chip" style="align-self:flex-start">← กลับไปตะกร้า</a>
      <h1 class="h1">ชำระเงิน</h1>
      <form id="checkout" class="split" novalidate>
        <div class="main card" style="display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:24px">
          <h2 class="h2" style="font-size:22px">1 · ข้อมูลจัดส่ง</h2>
          ${field("name", "ชื่อ-นามสกุล", 'autocomplete="name" placeholder="เช่น สมชาย ใจดี"')}
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            ${field("phone", "เบอร์โทรศัพท์", 'type="tel" inputmode="tel" autocomplete="tel" placeholder="08x-xxx-xxxx"', "1 1 220px")}
            ${field("email", "อีเมล", 'type="email" autocomplete="email" placeholder="you@example.com"', "1 1 220px")}
          </div>
          ${field("address", "ที่อยู่", 'autocomplete="street-address" placeholder="บ้านเลขที่ หมู่บ้าน/อาคาร ถนน"')}
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <label class="field ${errors.province ? "invalid" : ""}" style="flex:1 1 200px">จังหวัด
              <select name="province"><option value="">เลือกจังหวัด</option>${Object.keys(PROVINCES).map((p) => `<option ${p === d.province ? "selected" : ""}>${p}</option>`).join("")}</select>
              ${errors.province ? `<span class="err">${errors.province}</span>` : ""}</label>
            <label class="field ${errors.district ? "invalid" : ""}" style="flex:1 1 200px">เขต/อำเภอ
              <select name="district" ${districts.length ? "" : "disabled"}><option value="">เลือกเขต/อำเภอ</option>${districts.map((x) => `<option ${x === d.district ? "selected" : ""}>${x}</option>`).join("")}</select>
              ${errors.district ? `<span class="err">${errors.district}</span>` : ""}</label>
            ${field("zip", "รหัสไปรษณีย์", 'inputmode="numeric" maxlength="5" autocomplete="postal-code" placeholder="10xxx"', "1 1 140px")}
          </div>

          <h2 class="h2" style="font-size:22px;padding-top:8px">2 · วิธีจัดส่ง</h2>
          ${window.SHIPPING.methods.map((m) => {
            const fee = m.id === "standard" && t.free ? "ฟรี" : baht(m.fee);
            return `<label class="option"><input type="radio" name="ship" value="${m.id}" ${d.ship === m.id ? "checked" : ""}><span style="flex:1">${m.name}</span><b>${fee}</b></label>`;
          }).join("")}

          <h2 class="h2" style="font-size:22px;padding-top:8px">3 · วิธีชำระเงิน</h2>
          ${PAYMENTS.map((p) => `<label class="option"><input type="radio" name="pay" value="${p.id}" ${d.pay === p.id ? "checked" : ""}><span style="flex:1">${p.name}</span><span style="font-size:13px;font-weight:700">${p.note}</span></label>`).join("")}
          <label style="display:flex;align-items:center;gap:10px;font-size:14px"><input type="checkbox" name="taxInvoice" ${d.taxInvoice ? "checked" : ""} style="width:20px;height:20px">ต้องการใบกำกับภาษีเต็มรูป</label>
        </div>

        <aside class="side card summary" style="background:var(--green)">
          <div class="h2" style="font-size:24px">สรุปคำสั่งซื้อ</div>
          ${t.lines.map((l) => `<div style="display:flex;gap:12px;align-items:center">
            <div class="img" style="width:56px;height:56px;flex-shrink:0;border-radius:10px;background:${(l.product.colors.find((c) => c.name === l.color) || {}).hex || l.product.bg}">${window.UI.photo(l.product, 140)}</div>
            <div style="flex:1;min-width:0;font-size:14px"><b>${esc(l.product.name)}</b><div>${esc([l.color, l.size].filter(Boolean).join(" / "))} × ${l.qty}</div></div>
            <b>${baht(l.product.price * l.qty)}</b></div>`).join("")}
          <div style="border-top:var(--line);padding-top:12px;display:flex;flex-direction:column;gap:8px;font-size:15px">
            <div class="row"><span>ราคาสินค้า</span><span>${baht(t.subtotal)}</span></div>
            ${t.discount ? `<div class="row"><span>ส่วนลด (${esc(t.code)})</span><span>−${baht(t.discount)}</span></div>` : ""}
            <div class="row"><span>ค่าจัดส่ง</span><span>${t.shipping ? baht(t.shipping) : "ฟรี"}</span></div>
            ${t.cod ? `<div class="row"><span>ค่าเก็บเงินปลายทาง</span><span>${baht(t.cod)}</span></div>` : ""}
          </div>
          <div class="row total"><span>รวม</span><span>${baht(t.total)}</span></div>
          <button type="submit" class="btn btn-dark" style="font-size:19px">ยืนยันคำสั่งซื้อ</button>
          ${Object.keys(errors).length ? `<div style="color:var(--pink-deep);font-weight:800;font-size:14px" role="alert">กรอกข้อมูลให้ครบก่อนนะ</div>` : ""}
          <div style="font-size:12px;line-height:1.6">การกดยืนยันถือว่าคุณยอมรับเงื่อนไขการใช้บริการและนโยบายความเป็นส่วนตัว</div>
        </aside>
      </form>`;
  }

  function validate() {
    const e = {};
    if (!(d.name || "").trim()) e.name = "กรุณากรอกชื่อ";
    if (!/^0\d{8,9}$/.test((d.phone || "").replace(/[-\s]/g, ""))) e.phone = "เบอร์โทรไม่ถูกต้อง";
    if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) e.email = "อีเมลไม่ถูกต้อง";
    if (!(d.address || "").trim()) e.address = "กรุณากรอกที่อยู่";
    if (!d.province) e.province = "เลือกจังหวัด";
    if (!d.district) e.district = "เลือกเขต/อำเภอ";
    if (!/^\d{5}$/.test(d.zip || "")) e.zip = "รหัสไปรษณีย์ 5 หลัก";
    return e;
  }

  // save every keystroke to the draft; re-render only when totals/options change
  page.addEventListener("input", (ev) => {
    const el = ev.target;
    if (!el.name) return;
    d[el.name] = el.type === "checkbox" ? el.checked : el.value;
    if (el.name === "province") d.district = "";
    S.saveDraft(d);
    if (["ship", "pay", "province"].includes(el.name) || errors[el.name]) {
      if (errors[el.name]) delete errors[el.name];
      const focusName = el.type === "radio" || el.tagName === "SELECT" ? null : el.name;
      const pos = el.selectionStart;
      render();
      if (focusName) { const n = page.querySelector(`[name="${focusName}"]`); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } }
    }
  });

  page.addEventListener("submit", (ev) => {
    ev.preventDefault();
    errors = validate();
    if (Object.keys(errors).length) {
      render();
      const first = page.querySelector(".field.invalid input, .field.invalid select");
      if (first) first.focus();
      return;
    }
    const t = S.totals({ ship: d.ship, pay: d.pay });
    const order = {
      id: "ST" + Date.now().toString().slice(-8),
      createdAt: new Date().toISOString(),
      items: t.lines.map((l) => ({ id: l.id, name: l.product.name, color: l.color, size: l.size, qty: l.qty, price: l.product.price })),
      subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, cod: t.cod, total: t.total,
      ship: d.ship, pay: d.pay, payName: PAYMENTS.find((p) => p.id === d.pay).name,
      customer: { name: d.name, phone: d.phone, email: d.email, address: d.address, province: d.province, district: d.district, zip: d.zip, taxInvoice: !!d.taxInvoice },
    };
    S.addOrder(order);
    S.clearCart();
    S.setCoupon(null);
    history.replaceState(null, "", "checkout.html?order=" + order.id);
    renderSuccess(order);
    window.scrollTo(0, 0);
  });

  const done = qs("order") && S.orders().find((o) => o.id === qs("order"));
  if (done) renderSuccess(done); else render();
})();
