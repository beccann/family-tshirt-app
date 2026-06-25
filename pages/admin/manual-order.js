import { useState } from "react";

const EMPTY_SHIRT = {
  size: "Adult M",
  type: "Cotton",
  isTall: false,
  personalizationName: "",
  personalizationNumber: "",
  personalizationWings: false,
  quantity: 1
};

const PRICING = {
  baseCotton: 8,
  dryFit: 3,
  softFeel: 3,
  ladiesCotton: 3,
  tall: 5,
  personalization: {
    name: 6,
    number: 6,
    wings: 6
  }
};

export default function ManualOrderPage() {
  const [adminKey, setAdminKey] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    email: ""
  });
  const [shirts, setShirts] = useState([{ ...EMPTY_SHIRT }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const calculateTotal = () => {
    return shirts.reduce((sum, shirt) => {
      let total = PRICING.baseCotton;

      if (shirt.type === "Dry Fit") total += PRICING.dryFit;
      if (shirt.type === "Soft Feel") total += PRICING.softFeel;
      if (shirt.type === "Ladies Cotton") total += PRICING.ladiesCotton;

      if (shirt.isTall) total += PRICING.tall;

      if (shirt.personalizationName) total += PRICING.personalization.name;
      if (shirt.personalizationNumber) total += PRICING.personalization.number;
      if (shirt.personalizationWings) total += PRICING.personalization.wings;

      return sum + total * shirt.quantity;
    }, 0);
  };

  const total = calculateTotal();

  const updateShirt = (index, field, value) => {
    const updated = [...shirts];
    updated[index][field] = value;
    setShirts(updated);
  };

  const addShirt = () => {
    setShirts([
      ...shirts,
      { ...EMPTY_SHIRT }
    ]);
  };

  const resetForm = () => {
    setCustomer({ name: "", email: "" });
    setShirts([{ ...EMPTY_SHIRT }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!adminKey) {
      setError("Admin key is required.");
      return;
    }

    if (!customer.name.trim() || !customer.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!shirts.length) {
      setError("At least one shirt is required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey
        },
        body: JSON.stringify({
          name: customer.name.trim(),
          email: customer.email.trim(),
          shirts,
          total
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Unable to save order.");
      }

      setSuccess({
        name: customer.name.trim(),
        total,
        stripeId: data.stripeId
      });
      resetForm();
    } catch (err) {
      setError(err.message || "Unable to save order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Manual T-Shirt Order</h1>
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        Hidden admin page for entering late shirt orders after public ordering has closed.
      </p>

      {success && (
        <div
          style={{
            border: "1px solid #2e7d32",
            background: "#e8f5e9",
            color: "#1b5e20",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "6px"
          }}
        >
          <strong>Order saved successfully.</strong>
          <div>Name: {success.name}</div>
          <div>Total: ${success.total}</div>
          <div>Payment Status: offline</div>
          <div>Stripe Record: {success.stripeId}</div>
        </div>
      )}

      {error && (
        <div
          style={{
            border: "1px solid #c62828",
            background: "#ffebee",
            color: "#b71c1c",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "6px"
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h3>Admin Access</h3>

        <input
          type="password"
          placeholder="Admin Key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
        />

        <h3>Customer Information</h3>

        <input
          placeholder="Full Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
        />

        {shirts.map((shirt, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px"
            }}
          >
            <h3>Shirt #{index + 1}</h3>

            <select
              value={shirt.size}
              onChange={(e) => updateShirt(index, "size", e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            >
              <option>Youth S</option>
              <option>Youth M</option>
              <option>Youth L</option>
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
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            >
              <option>Cotton</option>
              <option>Dry Fit</option>
              <option>Soft Feel</option>
              <option>Ladies Cotton</option>
            </select>

            <label style={{ display: "block", marginBottom: "10px" }}>
              <input
                type="checkbox"
                checked={shirt.isTall}
                onChange={(e) => updateShirt(index, "isTall", e.target.checked)}
              />{" "}
              Tall
            </label>

            <input
              placeholder="Name on Shirt"
              value={shirt.personalizationName}
              onChange={(e) => updateShirt(index, "personalizationName", e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
            />

            <input
              placeholder="Number on Shirt"
              value={shirt.personalizationNumber}
              onChange={(e) => updateShirt(index, "personalizationNumber", e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
            />

            <label style={{ display: "block", marginBottom: "10px" }}>
              <input
                type="checkbox"
                checked={shirt.personalizationWings}
                onChange={(e) => updateShirt(index, "personalizationWings", e.target.checked)}
              />{" "}
              Add Angel Wings
            </label>

            <input
              type="number"
              value={shirt.quantity}
              min="1"
              onChange={(e) => updateShirt(index, "quantity", parseInt(e.target.value, 10) || 1)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        ))}

        <button type="button" onClick={addShirt} style={{ width: "100%", padding: "12px", marginBottom: "20px" }}>
          + Add Another Shirt
        </button>

        <h2>Total: ${total}</h2>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: "15px",
            background: "black",
            color: "white",
            fontWeight: "bold",
            opacity: submitting ? 0.7 : 1
          }}
        >
          {submitting ? "Saving Order..." : "Save Manual Order"}
        </button>
      </form>
    </div>
  );
}
