import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

export default function InvoicePortal() {
  const invoiceRef = useRef(null);

  const [brandName] = useState("Dhruba Creation");
  const [logo, setLogo] = useState(null);
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now()}`);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState([
    { name: "", qty: 1, price: 0 },
  ]);

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
    <div className="min-h-screen bg-gray-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Input type="file" accept="image/*" onChange={handleLogoUpload} />
          <Button onClick={downloadPDF}>Download PDF</Button>
        </div>

        {/* Invoice */}
        <div
          ref={invoiceRef}
          className="bg-white shadow-xl rounded-md overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {logo && (
                  <img src={logo} alt="logo" className="h-12" />
                )}
                <div>
                  <h1 className="text-xl font-bold">{brandName}</h1>
                  <p className="text-sm text-gray-500">
                    Creative Design & Services
                  </p>
                </div>
              </div>
              <h2 className="text-4xl font-bold tracking-wide">INVOICE</h2>
            </div>
            <div className="h-2 bg-yellow-400 mt-4" />
          </div>

          {/* Invoice Info */}
          <div className="p-6 grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Invoice to:</h3>
              <Input
                placeholder="Customer Name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="mb-2"
              />
              <Input placeholder="Address" />
            </div>

            <div className="text-right space-y-2">
              <div className="flex justify-end gap-2 items-center">
                <span className="font-semibold">Invoice #:</span>
                <Input
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-40 text-right"
                />
              </div>
              <div className="flex justify-end gap-2 items-center">
                <span className="font-semibold">Date:</span>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-40 text-right"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-6">
            <div className="grid grid-cols-4 bg-gray-700 text-white text-sm font-semibold p-3">
              <div>Item Description</div>
              <div className="text-center">Price</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Total</div>
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-b p-3 text-sm items-center"
              >
                <Input
                  placeholder="Item"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
                <Input
                  type="number"
                  className="text-center"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", Number(e.target.value))
                  }
                />
                <Input
                  type="number"
                  className="text-center"
                  value={item.qty}
                  onChange={(e) =>
                    updateItem(index, "qty", Number(e.target.value))
                  }
                />
                <div className="text-right font-medium">
                  ₹ {(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="p-4">
              <Button variant="outline" onClick={addItem}>
                + Add Row
              </Button>
            </div>
          </div>

          {/* Footer Totals */}
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="text-sm space-y-2">
              <p className="font-semibold">Terms & Conditions</p>
              <p className="text-gray-500">
                Thank you for your business. Payment due within agreed terms.
              </p>
            </div>

            <div className="text-right">
              <div className="flex justify-between text-sm mb-2">
                <span>Sub Total:</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="bg-yellow-400 text-black font-bold text-lg flex justify-between p-3">
                <span>Total:</span>
                <span>₹ {subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t p-6 text-xs text-gray-500 flex justify-between">
            <div>Dhruba Creation | Phone | Address | Website</div>
            <div>Authorised Sign</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
