import { useState } from "react";

export default function TshirtOrderApp() {

  const [customer, setCustomer] = useState({
    name: "",
    email: ""
  });

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
  successUrl:
    window.location.origin +
    "/success?name=" +
    encodeURIComponent(customer.name) +
    "&total=" +
    total +
    "&shirts=" +
    encodeURIComponent(JSON.stringify(shirts)),
  cancelUrl: window.location.href
})
    });

    const data = await response.json();
    window.location.href = data.url;
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", padding: "20px", fontFamily: "Arial" }}>

      <h1 style={{ textAlign: "center" }}>🏕️ Cooper Campout T-Shirt Order</h1>

      <h3>Submitter Info</h3>

      <input
        placeholder="Full Name"
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
          marginBottom: "20px"
        }}>

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

          <label>
            <input
              type="checkbox"
              checked={shirt.isTall}
              onChange={(e) => updateShirt(index, "isTall", e.target.checked)}
            /> Tall
          </label>

          <input
            placeholder="Name on Shirt"
            value={shirt.personalizationName}
            onChange={(e) => updateShirt(index, "personalizationName", e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px" }}
          />

          <input
            placeholder="Number on Shirt"
            value={shirt.personalizationNumber}
            onChange={(e) => updateShirt(index, "personalizationNumber", e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "8px" }}
          />

          <label>
            <input
              type="checkbox"
              checked={shirt.personalizationWings}
              onChange={(e) => updateShirt(index, "personalizationWings", e.target.checked)}
            /> Add Angel Wings
          </label>

          <input
            type="number"
            value={shirt.quantity}
            min="1"
            onChange={(e) => updateShirt(index, "quantity", parseInt(e.target.value) || 1)}
            style={{ width: "100%", padding: "8px", marginTop: "8px" }}
          />

        </div>
      ))}

      <button onClick={addShirt} style={{ width: "100%", padding: "12px" }}>
        + Add Another Shirt
      </button>

      <h2>Total: ${total}</h2>

      <button onClick={handleSubmit} style={{
        width: "100%",
        padding: "15px",
        background: "black",
        color: "white",
        fontWeight: "bold"
      }}>
        Pay & Submit Order
      </button>

    </div>
  );
}
