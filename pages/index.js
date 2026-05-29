import { useState } from "react";

export default function TshirtOrderApp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    size: "M",
    type: "Cotton",
    isTall: false,
    personalizationName: "",
    personalizationNumber: "",
    personalizationWings: false,
    quantity: 1
  });

  // ✅ YOUR PRICING
  const PRICING = {
    baseCotton: 8,
    softFeel: 3,
    ladiesCotton: 3,
    dryFit: 3,
    tall: 5,
    dryFitTall: 5,
    size: {
      "2XL": 2,
      "3XL": 4,
      "4XL": 5,
      "5XL": 6
    },
    personalization: {
      name: 6,
      number: 6,
      wings: 6
    }
  };

  const calculateTotal = () => {
    let total = PRICING.baseCotton;

    // Shirt type
    if (form.type === "Soft Feel") total += PRICING.softFeel;
    if (form.type === "Ladies Cotton") total += PRICING.ladiesCotton;
    if (form.type === "Dry Fit") total += PRICING.dryFit;

    // Tall logic
    if (form.isTall) {
      if (form.type === "Dry Fit") total += PRICING.dryFitTall;
      else total += PRICING.tall;
    }

    // Size upcharges
    if (PRICING.size[form.size]) {
      total += PRICING.size[form.size];
    }

    // Personalization
    if (form.personalizationName) total += PRICING.personalization.name;
    if (form.personalizationNumber) total += PRICING.personalization.number;
    if (form.personalizationWings) total += PRICING.personalization.wings;

    return total * form.quantity;
  };

  const total = calculateTotal();

  // ✅ DYNAMIC STRIPE CALL
  const handleSubmit = async () => {
const baseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : window.location.origin;

const response = await fetch(`${baseUrl}/api/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...form,
        total,
        successUrl: window.location.origin + "/success",
        cancelUrl: window.location.href
      })
    });

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h1>🎉 Family Reunion T-Shirt Order</h1>

      <input
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <select
        value={form.size}
        onChange={(e) => setForm({ ...form, size: e.target.value })}
      >
        {["S","M","L","XL","2XL","3XL","4XL","5XL"].map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option>Cotton</option>
        <option>Ladies Cotton</option>
        <option>Soft Feel</option>
        <option>Dry Fit</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={form.isTall}
          onChange={(e) => setForm({ ...form, isTall: e.target.checked })}
        />
        Tall
      </label>

      <input
        placeholder="Name on Shirt"
        value={form.personalizationName}
        onChange={(e) => setForm({ ...form, personalizationName: e.target.value })}
      />

      <input
        placeholder="Number on Shirt"
        value={form.personalizationNumber}
        onChange={(e) => setForm({ ...form, personalizationNumber: e.target.value })}
      />

      <label>
        <input
          type="checkbox"
          checked={form.personalizationWings}
          onChange={(e) => setForm({ ...form, personalizationWings: e.target.checked })}
        />
        Add Angel Wings
      </label>

      <input
        type="number"
        min="1"
        value={form.quantity}
        onChange={(e) =>
          setForm({ ...form, quantity: parseInt(e.target.value) || 1 })
        }
      />

      <h2>Total: ${total}</h2>

      <button onClick={handleSubmit}>
        Pay & Submit Order
      </button>
    </div>
  );
}
``
