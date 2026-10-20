// All client state lives in localStorage under the "shopth." prefix.
(function () {
  const P = "shopth.";
  const read = (k, fallback) => {
    try { const v = localStorage.getItem(P + k); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  };
  const write = (k, v) => {
    try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ }
    window.dispatchEvent(new CustomEvent("store:change", { detail: k }));
  };
  const lineKey = (id, color, size) => [id, color || "", size || ""].join("|");

  const Store = {
    // ---- cart: [{key,id,color,size,qty}]
    cart() { return read("cart", []); },
    add(id, color, size, qty) {
      const cart = Store.cart();
      const key = lineKey(id, color, size);
      const line = cart.find((l) => l.key === key);
      if (line) line.qty += qty; else cart.push({ key, id, color, size, qty });
      write("cart", cart);
    },
    setQty(key, qty) {
      let cart = Store.cart();
      cart = qty <= 0 ? cart.filter((l) => l.key !== key) : cart.map((l) => (l.key === key ? { ...l, qty } : l));
      write("cart", cart);
    },
    remove(key) { write("cart", Store.cart().filter((l) => l.key !== key)); },
    clearCart() { write("cart", []); },
    count() { return Store.cart().reduce((n, l) => n + l.qty, 0); },

    // ---- coupon
    coupon() { return read("coupon", null); },
    setCoupon(code) { write("coupon", code); },

    // ---- user reviews: {productId: [review]}
    reviews(id) { return (read("reviews", {})[id]) || []; },
    addReview(id, review) {
      const all = read("reviews", {});
      all[id] = [review, ...(all[id] || [])];
      write("reviews", all);
    },
    helpful() { return read("helpful", {}); },
    toggleHelpful(rid) { const h = Store.helpful(); h[rid] = !h[rid]; write("helpful", h); },

    // ---- orders
    orders() { return read("orders", []); },
    addOrder(o) { write("orders", [o, ...Store.orders()]); },

    // ---- checkout draft (so a refresh keeps the form)
    draft() { return read("checkoutDraft", {}); },
    saveDraft(d) { write("checkoutDraft", d); },
  };

  // ---- pricing (shared by cart + checkout)
  Store.totals = function (opts) {
    opts = opts || {};
    const lines = Store.cart()
      .map((l) => ({ ...l, product: window.PRODUCTS.find((p) => p.id === l.id) }))
      .filter((l) => l.product);
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    const code = Store.coupon();
    const c = code && window.COUPONS[code];
    const discount = c && subtotal >= c.min ? Math.min(c.amount, subtotal) : 0;
    const method = window.SHIPPING.methods.find((m) => m.id === opts.ship) || window.SHIPPING.methods[0];
    const free = subtotal >= window.SHIPPING.freeOver;
    const shipping = lines.length === 0 ? 0 : free && method.id === "standard" ? 0 : method.fee;
    const cod = opts.pay === "cod" ? window.SHIPPING.codFee : 0;
    return { lines, subtotal, discount, code: discount ? code : null, shipping, free, cod, total: subtotal - discount + shipping + cod };
  };

  window.Store = Store;
})();
