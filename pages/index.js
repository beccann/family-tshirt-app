import { useState } from "react";

export default function TshirtOrderApp() {

  const [customer, setCustomer] = useState({
    name: "",
    email: ""
  });

  const [shirts, setShirts] = useState([
    { size: "Adult M", type: "Cotton", quantity: 1 }
  ]);

  const PRICES = {
    Cotton: 8,
    "Dry Fit": 11,
    "Soft Feel": 11,
    "Ladies Cotton": 11
  };

  const updateShirt = (index, field, value) => {
    const updated = [...shirts];
    updated[index][field] = value;
    setShirts(updated);
  };

  const addShirt = () => {
    setShirts([...shirts, { size: "Adult M", type: "Cotton", quantity: 1 }]);
  };

  const calculateTotal = () => {
    return shirts.reduce((sum, shirt) => {
      const price = PRICES[shirt.type] || 8;
      return sum + price * shirt.quantity;
    }, 0);
  };

  const total = calculateTotal();

  const handleSubmit = async () => {
    const response = await fetch("/api/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        shirts: shirts,
        total: total,
        successUrl: window.location.origin + "/success",
        cancelUrl: window.location.href
      })
    });

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>

      <h1>🏕️ Cooper Campout T-Shirt Order</h1>

      <h3>Submitter Info</h3>

      <input
        placeholder="Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        placeholder="Email"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      {shirts.map((shirt, index) => (
        <div key={index} style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "5px"
        }}>
          <h3>Shirt #{index + 1}</h3>

          <select
            value={shirt.size}
            onChange={(e) => updateShirt(index, "size", e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
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
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          >
            <option>Cotton</option>
            <option>Dry Fit</option>
            <option>Soft Feel</option>
            <option>Ladies Cotton</option>
          </select>

          <input
            type="number"
            min="1"
            value={shirt.quantity}
            onChange={(e) => updateShirt(index, "quantity", parseInt(e.target.value) || 1)}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
      ))}

      <button
        onClick={addShirt}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      >
        + Add Another Shirt
      </button>

      <h2>Total: ${total}</h2>

      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "14px",
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
