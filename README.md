# SHOP.th — E-commerce demo

เว็บ e-commerce 4 หน้า (HTML/CSS/JS ล้วน ไม่ต้อง build) ธีม bold & colorful
State ทั้งหมดเก็บใน `localStorage` (prefix `shopth.`) ยังไม่มี backend

## หน้า

| หน้า | ไฟล์ | ทำอะไรได้ |
|---|---|---|
| Product list | `index.html` | ค้นหา (`?q=`), กรองหมวด (`?cat=`), filter ส่งฟรี/ลดราคา/ดาวสูง, sort |
| Product info | `product.html?id=…` | เลือกสี/ไซซ์/จำนวน, เพิ่มลงตะกร้า, ซื้อเลย, รีวิวดาว + เขียนรีวิว, กด "เป็นประโยชน์" |
| Shopping cart | `cart.html` | ปรับจำนวน, ลบ, ล้างตะกร้า, โค้ดส่วนลด (`SHOP50`), แถบส่งฟรี |
| Checkout | `checkout.html` | ฟอร์มจัดส่ง + validate, เลือกขนส่ง/วิธีจ่าย, สร้าง order แล้วล้างตะกร้า |

## รัน

```bash
npx serve .        # หรือ python3 -m http.server 8080
```

เปิดไฟล์ `index.html` ตรง ๆ ก็ได้

## โครงสร้าง

```
css/style.css        design tokens + components
js/data.js           สินค้า หมวด คูปอง ค่าส่ง (แก้ข้อมูลที่นี่)
js/store.js          localStorage: cart, coupon, reviews, helpful, orders, checkout draft + คำนวณราคา
js/common.js         helpers, header/footer, product card, toast
js/pages/*.js        logic แต่ละหน้า
```

## localStorage keys

`shopth.cart` · `shopth.coupon` · `shopth.reviews` · `shopth.helpful` · `shopth.orders` · `shopth.checkoutDraft` · `shopth.listPrefs`

ล้างข้อมูลทั้งหมด: DevTools → Application → Local Storage → ลบ key ที่ขึ้นต้น `shopth.`

## รูปสินค้า

ตอนนี้เป็นกล่องสี placeholder ใส่รูปจริงได้โดยวางไฟล์ใน `assets/` แล้วตั้ง `image: "assets/xxx.jpg"` ใน `js/data.js`

> คะแนนรีวิว ยอดขาย และรีวิวใน `data.js` เป็นข้อมูลตัวอย่าง
