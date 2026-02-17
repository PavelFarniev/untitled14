const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
const port = 3000;

let products = [
  { id: nanoid(6), name: "Смартфон Samsung Galaxy", category: "Телефоны", description: "Современный смартфон с AMOLED экраном 6.1 дюйма", price: 45990, quantity: 15 },
  { id: nanoid(6), name: "Ноутбук Apple MacBook Air", category: "Ноутбуки", description: "Легкий ноутбук с чипом M2, 8GB RAM, 256GB SSD", price: 119990, quantity: 8 },
  { id: nanoid(6), name: "Наушники Sony WH-1000XM5", category: "Аксессуары", description: "Беспроводные наушники с шумоподавлением", price: 29990, quantity: 22 },
  { id: nanoid(6), name: "Планшет iPad 10.9", category: "Планшеты", description: "Планшет с дисплеем Liquid Retina 10.9 дюйма", price: 42990, quantity: 12 },
  { id: nanoid(6), name: "Умные часы Apple Watch Series 9", category: "Аксессуары", description: "Смарт-часы с дисплеем Always-On", price: 35990, quantity: 18 },
  { id: nanoid(6), name: "Монитор LG 27\" 4K", category: "Мониторы", description: "Монитор 27 дюймов с разрешением 4K UHD", price: 28990, quantity: 7 },
  { id: nanoid(6), name: "Клавиатура Logitech MX Keys", category: "Периферия", description: "Беспроводная механическая клавиатура", price: 12990, quantity: 25 },
  { id: nanoid(6), name: "Веб-камера Logitech C920", category: "Периферия", description: "Full HD веб-камера 1080p 30fps", price: 7990, quantity: 30 },
  { id: nanoid(6), name: "Внешний SSD Samsung 1TB", category: "Накопители", description: "Портативный SSD накопитель USB 3.2", price: 8990, quantity: 40 },
  { id: nanoid(6), name: "Игровая мышь Razer DeathAdder", category: "Периферия", description: "Эргономичная игровая мышь с подсветкой", price: 5990, quantity: 35 },
];

app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      console.log("Body:", req.body);
    }
  });
  next();
});

function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

app.post("/api/products", (req, res) => {
  const { name, category, description, price, quantity } = req.body;
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: (category || "").trim(),
    description: (description || "").trim(),
    price: Number(price) || 0,
    quantity: Number(quantity) || 0,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  if (
    req.body?.name === undefined &&
    req.body?.category === undefined &&
    req.body?.description === undefined &&
    req.body?.price === undefined &&
    req.body?.quantity === undefined
  ) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  const { name, category, description, price, quantity } = req.body;
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (quantity !== undefined) product.quantity = Number(quantity);
  res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });
  products = products.filter((p) => p.id !== id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
