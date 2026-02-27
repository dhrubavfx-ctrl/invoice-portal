// =============================
// AUTOMATIC INVOICE GENERATOR
// READY FOR VERCEL DEPLOYMENT
// =============================

// 👉 PROJECT STRUCTURE
// invoice-portal/
// ├─ index.html
// ├─ package.json
// ├─ vite.config.js
// └─ src/
//     ├─ main.jsx
//     └─ App.jsx


// =============================
// package.json
// =============================
{
  "name": "invoice-portal",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0",
    "jspdf": "^2.5.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}


// =============================
// vite.config.js
// =============================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})


// =============================
// index.html
// =============================
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dhruba Creation Invoice</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>


// =============================
// src/main.jsx
// =============================
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// =============================
// src/App.jsx
// =============================
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function App() {
  const invoiceRef = useRef(null);

  const [brandName] = useState("Dhruba Creation");
  const [logo, setLogo] = useState(null);
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now()}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { name: "", qty: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(invoiceRef.current, {
      callback: function (doc) {
        doc.save(`${invoiceNo}.pdf`);
      },
      x: 20,
      y: 20,
      width: 555,
      windowWidth: 900,
    });
  };

  return (
    <div style={{ background: "#eee", minHeight: "100vh", padding: 30 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 900, margin: "auto" }}
      >
        <div style={{ marginBottom: 15 }}>
          <input type="file" onChange={handleLogoUpload} />
          <button onClick={downloadPDF} style={{ marginLeft: 10 }}>
            Download PDF
          </button>
        </div>

        <div ref={invoiceRef} style={{ background: "#fff", padding: 25 }}>
          <h1>{brandName}</h1>
          <h2>INVOICE</h2>

          <div>
            Customer:
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>

          <div>
            Invoice No:
            <input
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>

          <div>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <hr />

          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: 10 }}>
              <input
                placeholder="Item"
                value={item.name}
                onChange={(e) =>
                  updateItem(index, "name", e.target.value)
                }
              />
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(index, "price", Number(e.target.value))
                }
              />
              <input
                type="number"
                value={item.qty}
                onChange={(e) =>
                  updateItem(index, "qty", Number(e.target.value))
                }
              />
              <span>₹ {(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}

          <button onClick={addItem}>+ Add Row</button>

          <h3>Total: ₹ {subtotal.toFixed(2)}</h3>
        </div>
      </motion.div>
    </div>
  );
}
