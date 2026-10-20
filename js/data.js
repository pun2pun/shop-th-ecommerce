// Demo catalog. Ratings, reviews and sales numbers are sample data.
// To use real photos: put files in /assets and set `image: "assets/xxx.jpg"`.
window.CATEGORIES = [
  { id: "fashion", name: "แฟชั่น" },
  { id: "home", name: "ของใช้ในบ้าน" },
  { id: "stationery", name: "เครื่องเขียน" },
  { id: "gadget", name: "แกดเจ็ต" },
];

window.PRODUCTS = [
  {
    id: "tee-basic", name: "เสื้อยืดคอกลม Basic", category: "fashion",
    price: 290, oldPrice: 390, sold: 5200, stock: 48, freeShip: true, bg: "#5BD1F5", image: null,
    desc: "เสื้อยืดคอกลมผ้าคอตตอน 100% เนื้อผ้านุ่ม ระบายอากาศดี ไม่ย้วยหลังซัก ทรง Regular fit ใส่ได้ทั้งชายและหญิง",
    colors: [{ name: "ฟ้า", hex: "#5BD1F5" }, { name: "ชมพู", hex: "#FF4F8B" }, { name: "ขาว", hex: "#FFFFFF" }, { name: "ดำ", hex: "#1B1035" }],
    sizes: ["S", "M", "L", "XL", "XXL"], soldOutSizes: ["XXL"],
    specs: [["เนื้อผ้า", "Cotton 100% (180 GSM)"], ["ทรง", "Regular fit"], ["ไซซ์ M", "อก 40\" · ยาว 28\""], ["การดูแล", "ซักเครื่องน้ำเย็น ห้ามใช้น้ำยาฟอกขาว"]],
    ratingDist: [1023, 150, 50, 13, 12],
    reviews: [
      { name: "มิ้นท์ ส.", rating: 5, date: "2026-10-12", variant: "ฟ้า / M", text: "ผ้านุ่มมาก ใส่สบาย ซักไปสามรอบแล้วไม่ย้วย สีตรงปก ส่งไวด้วย", helpful: 24 },
      { name: "บอส ก.", rating: 4, date: "2026-10-05", variant: "ดำ / L", text: "คุณภาพดีเกินราคา แต่ไซซ์ L ตัวใหญ่กว่าที่คิด แนะนำลดลงหนึ่งไซซ์", helpful: 11 },
      { name: "แพร ว.", rating: 5, date: "2026-09-28", variant: "ขาว / S", text: "สีขาวไม่บาง ใส่แล้วไม่โป๊ ใส่ทำงานกับแจ็คเก็ตได้เลย", helpful: 8 },
    ],
  },
  {
    id: "tote-canvas", name: "กระเป๋าผ้าแคนวาส", category: "fashion",
    price: 390, oldPrice: null, sold: 1800, stock: 120, freeShip: true, bg: "#FF8A3D", image: null,
    desc: "กระเป๋าผ้าแคนวาสหนา 12oz ใส่โน้ตบุ๊ก 14 นิ้วได้ มีช่องซิปด้านใน",
    colors: [{ name: "ครีม", hex: "#F3E7C9" }, { name: "ดำ", hex: "#1B1035" }], sizes: [], soldOutSizes: [],
    specs: [["วัสดุ", "Canvas 12oz"], ["ขนาด", "38 × 42 × 10 ซม."], ["ช่องเก็บ", "ช่องซิปด้านใน 1 ช่อง"]],
    ratingDist: [400, 90, 30, 7, 5],
    reviews: [
      { name: "ฟ้า ร.", rating: 5, date: "2026-10-10", variant: "ครีม", text: "ผ้าหนาดี ใส่ของหนักได้ ใช้ไปมหาลัยทุกวัน", helpful: 6 },
      { name: "นนท์ พ.", rating: 4, date: "2026-09-30", variant: "ดำ", text: "สวย ใช้ดี อยากให้สายยาวกว่านี้นิดนึง", helpful: 3 },
    ],
  },
  {
    id: "mug-ceramic", name: "แก้วเซรามิกมินิมอล", category: "home",
    price: 350, oldPrice: 450, sold: 3100, stock: 60, freeShip: false, bg: "#9EE37D", image: null,
    desc: "แก้วเซรามิกเคลือบด้าน 350 ml เข้าไมโครเวฟและเครื่องล้างจานได้",
    colors: [{ name: "ขาว", hex: "#FFFFFF" }, { name: "เขียว", hex: "#9EE37D" }], sizes: [], soldOutSizes: [],
    specs: [["ความจุ", "350 ml"], ["วัสดุ", "Stoneware ceramic"], ["ใช้กับ", "ไมโครเวฟ · เครื่องล้างจาน"]],
    ratingDist: [750, 80, 20, 6, 4],
    reviews: [
      { name: "เจ ม.", rating: 5, date: "2026-10-08", variant: "ขาว", text: "สวยมาก เนื้อแก้วหนา แพ็คมาดีไม่แตก", helpful: 9 },
    ],
  },
  {
    id: "notebook-leather", name: "สมุดปกหนังสังเคราะห์", category: "stationery",
    price: 220, oldPrice: null, sold: 640, stock: 200, freeShip: false, bg: "#C9A7FF", image: null,
    desc: "สมุดขนาด A5 กระดาษถนอมสายตา 100 แกรม 160 หน้า เส้นจุด",
    colors: [{ name: "น้ำตาล", hex: "#8B5A2B" }, { name: "ม่วง", hex: "#C9A7FF" }], sizes: [], soldOutSizes: [],
    specs: [["ขนาด", "A5"], ["กระดาษ", "100 แกรม · 160 หน้า"], ["ลาย", "Dot grid"]],
    ratingDist: [150, 40, 15, 5, 4],
    reviews: [{ name: "ปอ ท.", rating: 4, date: "2026-09-20", variant: "น้ำตาล", text: "กระดาษดี ปากกาหมึกซึมไม่ทะลุ", helpful: 2 }],
  },
  {
    id: "headphone-pro", name: "หูฟังไร้สาย Pro", category: "gadget",
    price: 1990, oldPrice: 2990, sold: 8400, stock: 15, freeShip: true, bg: "#FF4F8B", image: null,
    desc: "หูฟังไร้สาย ตัดเสียงรบกวน ใช้งานต่อเนื่อง 30 ชม. ชาร์จ USB-C",
    colors: [{ name: "ดำ", hex: "#1B1035" }, { name: "ขาว", hex: "#FFFFFF" }], sizes: [], soldOutSizes: [],
    specs: [["แบตเตอรี่", "สูงสุด 30 ชม."], ["เชื่อมต่อ", "Bluetooth 5.3"], ["ชาร์จ", "USB-C"], ["รับประกัน", "1 ปี"]],
    ratingDist: [1500, 380, 100, 30, 21],
    reviews: [
      { name: "กอล์ฟ ส.", rating: 5, date: "2026-10-15", variant: "ดำ", text: "ตัดเสียงดีเกินราคา แบตอึดจริง", helpful: 31 },
      { name: "ไอซ์ น.", rating: 4, date: "2026-10-02", variant: "ขาว", text: "เสียงดี ใส่นานแล้วเจ็บหูนิดหน่อย", helpful: 7 },
    ],
  },
  {
    id: "lamp-desk", name: "โคมไฟตั้งโต๊ะ", category: "home",
    price: 890, oldPrice: null, sold: 920, stock: 5, freeShip: false, bg: "#FFD60A", image: null,
    desc: "โคมไฟ LED ปรับแสงได้ 3 ระดับ หัวโคมหมุนได้ 180 องศา",
    colors: [{ name: "เหลือง", hex: "#FFD60A" }, { name: "ขาว", hex: "#FFFFFF" }], sizes: [], soldOutSizes: [],
    specs: [["หลอด", "LED 8W"], ["ปรับแสง", "3 ระดับ"], ["สาย", "USB 1.5 ม."]],
    ratingDist: [200, 70, 30, 10, 8],
    reviews: [{ name: "ต้น ว.", rating: 4, date: "2026-09-25", variant: "เหลือง", text: "สีน่ารัก แสงสบายตา", helpful: 4 }],
  },
  {
    id: "bottle-steel", name: "ขวดน้ำสแตนเลส 750ml", category: "home",
    price: 459, oldPrice: null, sold: 2300, stock: 80, freeShip: true, bg: "#5BD1F5", image: null,
    desc: "ขวดน้ำสแตนเลส 2 ชั้น เก็บเย็น 24 ชม. เก็บร้อน 12 ชม.",
    colors: [{ name: "ฟ้า", hex: "#5BD1F5" }, { name: "ชมพู", hex: "#FF4F8B" }], sizes: [], soldOutSizes: [],
    specs: [["ความจุ", "750 ml"], ["วัสดุ", "Stainless 304"], ["เก็บอุณหภูมิ", "เย็น 24 ชม. · ร้อน 12 ชม."]],
    ratingDist: [520, 120, 30, 10, 10],
    reviews: [{ name: "แนน ค.", rating: 5, date: "2026-10-11", variant: "ชมพู", text: "เย็นทั้งวันจริง ฝาไม่รั่ว", helpful: 5 }],
  },
  {
    id: "cap-washed", name: "หมวกแก๊ปผ้าฟอก", category: "fashion",
    price: 250, oldPrice: null, sold: 1100, stock: 70, freeShip: false, bg: "#FF8A3D", image: null,
    desc: "หมวกแก๊ปผ้าฟอกนุ่ม ปรับขนาดด้านหลังได้",
    colors: [{ name: "ส้ม", hex: "#FF8A3D" }, { name: "ดำ", hex: "#1B1035" }], sizes: ["Free size"], soldOutSizes: [],
    specs: [["วัสดุ", "Cotton twill ผ้าฟอก"], ["ขนาด", "ปรับได้ 54–60 ซม."]],
    ratingDist: [260, 100, 30, 7, 5],
    reviews: [{ name: "บีม อ.", rating: 4, date: "2026-10-01", variant: "ดำ", text: "ทรงสวย ผ้านิ่ม", helpful: 1 }],
  },
];

window.COUPONS = { SHOP50: { label: "ลด ฿50", amount: 50, min: 0 } };
window.SHIPPING = {
  freeOver: 1000,
  methods: [
    { id: "standard", name: "ส่งธรรมดา · 2-3 วัน", fee: 50 },
    { id: "express", name: "ส่งด่วน · 1 วัน", fee: 80 },
  ],
  codFee: 30,
};
