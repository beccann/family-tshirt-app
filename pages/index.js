import { useState } from "react";

export default function TshirtOrderApp() {
  const [shirts, setShirts] = useState([
    {
      size: "Adult M",
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

      return grandTotal + total * form.quantity;
    }, 0);
  };

  const total = calculateTotal();

  const addShirt = () => {
    setShirts([
      ...shirts,
      {
        size: "Adult M",
        type: "Cotton",
        isTall: false,
        personalizationName: "",
        personalizationNumber: "",
        personalizationWings: false,
        quantity: 1
      }
    ]);
  };

  const updateShirt = (index, field, value) => {
    const updated = [...shirts];
    updated[index][field] = value;
    setShirts(updated);
  };

  // ✅ CLEAN SUBMIT (does NOT break Stripe)
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: customer.email,
          total: total
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Checkout failed");
        return;
      }

      window.location.href = data.url;

    } catch (err) {
      alert("Something broke: " + err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <h1>🏕️ Cooper Campout T-Shirt Order</h1>

      <h3>Submitter Info</h3>

      <input
        placeholder="Full Name"
        value={customer.name}
        onChange={(e) =>
          setCustomer({ ...customer, name: e.target.value })
        }
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        placeholder="Email"
        value={customer.email}
        onChange={(e) =>
          setCustomer({ ...customer, email: e.target.value })
        }
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      {shirts.map((shirt, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "5px"
          }}
        >
          <h3>Shirt #{index + 1}</h3>

          <select
            value={shirt.size}
            onChange={(e) => updateShirt(index, "size", e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option>Adult S</option>
            <option>Adult M</option>
            <option>Adult L</option>
            <option>Adult XL</option>
            <option>2XL</option>
            <option>3XL</option>
            <option>4XL</option>
            <option>5XL</option>
          </select>

          <select
            value={shirt.type}
            onChange={(e) => updateShirt(index, "type", e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option>Cotton</option>
            <option>Ladies Cotton</option>
            <option>Soft Feel</option>
            <option>Dry Fit</option>
          </select>

          <label style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={shirt.isTall}
              onChange={(e) =>
                updateShirt(index, "isTall", e.target.checked)
              }
            />
            Tall
          </label>

          {/* ✅ PERSONALIZATION BACK */}
          <input
            placeholder="Name on Shirt"
            value={shirt.personalizationName}
            onChange={(e) =>
              updateShirt(index, "personalizationName", e.target.value)
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <input
            placeholder="Number on Shirt"
            value={shirt.personalizationNumber}
            onChange={(e) =>
              updateShirt(index, "personalizationNumber", e.target.value)
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <label style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={shirt.personalizationWings}
              onChange={(e) =>
                updateShirt(index, "personalizationWings", e.target.checked)
              }
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
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <button
        onClick={addShirt}
        style={{
          marginBottom: "20px",
          padding: "10px",
          width: "100%"
        }}
      >
        ➕ Add Another Shirt
      </button>

      <h2>Total: ${total}</h2>

      <button
        onClick={handleSubmit}
        style={{
          padding: "12px",
          width: "100%",
          background: "black",
          color: "white",
          fontWeight: "bold"
        }}
      >
        Pay & Submit Order
      </button>
    </div>
  );
}
