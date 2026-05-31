import { useState } from "react";

export default function TshirtOrderApp() {

  // ✅ MULTIPLE SHIRTS
  const [shirts, setShirts] = useState([
    {
      size: "M",
      type: "Cotton",
      isTall: false,
      personalizationName: "",
      personalizationNumber: "",
      personalizationWings: false,
      quantity: 1
    }
  ]);

  const [customer, setCustomer] = useState({
    name: "",
    email: ""
  });

  // ✅ PRICING
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

  // ✅ CALCULATE TOTAL
  const calculateTotal = () => {
    return shirts.reduce((grandTotal, form) => {
      let total = PRICING.baseCotton;

      if (form.type === "Soft Feel") total += PRICING.softFeel;
      if (form.type === "Ladies Cotton") total += PRICING.ladiesCotton;
      if (form.type === "Dry Fit") total += PRICING.dryFit;

      if (form.isTall) {
        if (form.type === "Dry Fit") total += PRICING.dryFitTall;
        else total += PRICING.tall;
      }

      if (PRICING.size[form.size]) {
        total += PRICING.size[form.size];
      }

      if (form.personalizationName) total += PRICING.personalization.name;
      if (form.personalizationNumber) total += PRICING.personalization.number;
      if (form.personalizationWings) total += PRICING.personalization.wings;

      return grandTotal + (total * form.quantity);
    }, 0);
  };

  const total = calculateTotal();

  // ✅ ADD SHIRT
  const addShirt = () => {
    setShirts([
      ...shirts,
      {
        size: "M",
        type: "Cotton",
        isTall: false,
        personalizationName: "",
        personalizationNumber: "",
        personalizationWings: false,
        quantity: 1
      }
    ]);
  };

  // ✅ UPDATE SHIRT
  const updateShirt = (index, field, value) => {
    const updated = [...shirts];
    updated[index][field] = value;
    setShirts(updated);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: customer.name,
          email: customer.email,
          shirts,
          total,
          successUrl: window.location.origin,
          cancelUrl: window.location.href
        })
      });

      if (!response.ok) {
        alert("Request failed: " + response.status);
        return;
      }

      const data = await response.json();

      if (!data.url) {
        alert("No Stripe URL returned");
        return;
      }

      window.location.href = data.url;

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>🎉 Family Reunion T-Shirt Order</h1>

      <h3>Customer Info</h3>

      <input
        placeholder="Full Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
      />

      <hr />

      {shirts.map((shirt, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
          <h3>Shirt #{index + 1}</h3>

          <select
            value={shirt.size}
            onChange={(e) => updateShirt(index, "size", e.target.value)}
          >
            {["S","M","L","XL","2XL","3XL","4XL","5XL"].map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={shirt.type}
            onChange={(e) => updateShirt(index, "type", e.target.value)}
          >
            <option>Cotton</option>
            <option>Ladies Cotton</option>
            <option>Soft Feel</option>
            <option>Dry Fit</option>
          </select>

          <label>
            <input
              type="checkbox"
              checked={shirt.isTall}
              onChange={(e) => updateShirt(index, "isTall", e.target.checked)}
            />
            Tall
          </label>

          <input
            placeholder="Name on Shirt"
            value={shirt.personalizationName}
            onChange={(e) => updateShirt(index, "personalizationName", e.target.value)}
          />

          <input
            placeholder="Number on Shirt"
            value={shirt.personalizationNumber}
            onChange={(e) => updateShirt(index, "personalizationNumber", e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={shirt.personalizationWings}
              onChange={(e) => updateShirt(index, "personalizationWings", e.target.checked)}
            />
            Add Angel Wings
          </label>

          <input
            type="number"
            min="1"
            value={shirt.quantity}
            onChange={(e) =>
              updateShirt(index, "quantity", parseInt(e.target.value) || 1)
            }
          />
        </div>
      ))}

      <button onClick={addShirt}>
        ➕ Add Another Shirt
      </button>

      <h2>Total: ${total}</h2>

      <button onClick={handleSubmit}>
        Pay & Submit Order
      </button>
    </div>
  );
}
