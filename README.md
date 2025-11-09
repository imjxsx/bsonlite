<div align="center">
  <h1>🧠 @imjxsx/bsonlite (v1.0.1)</h1>
  <p>A lightweight, encrypted, BSON-based database for Node.js applications</p>
</div>

---

<div align="center">
  <h3>📥 Installation</h3>
</div>

```bash
# With NPM
npm install @imjxsx/bsonlite

# With PNPM
pnpm add @imjxsx/bsonlite

# With Yarn
yarn add @imjxsx/bsonlite

# With Bun
bun add @imjxsx/bsonlite
```

---

<div align="center">
  <h3>🚀 Use</h3>
</div>

```javascript
// index.js
import BSONLite from "@imjxsx/bsonlite";

// <T>(filepath: string, logger?: Optional<Logger>, encrypt?: Optional<boolean>, password?: Optional<string>)
const db = new BSONLite("./database", undefined, true, "P@ssword1234!");
await db.load();
db.set("users", [
  {
    id: 1,
    name: "Jxsx",
    role: "Developer",
  }, {
    id: 2,
    name: "Luna",
    role: "Tester",
  },
]);
db.set("config.theme", "dark").set("config.version", 1);
await db.save();
console.log(db.get("users[0].name")); // -> "Jxsx"
console.log(db.get("config.theme")); // -> "dark"
console.log(db.has("users[1].role")); // -> true
```

---

<div align="center">
  <p>
    <b>Created and maintained with ❤ by <a href="https://github.com/imjxsx">I'm Jxsx</a></b>
  </p>
</div>

---
