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

  const calculateTotal = () => {
    return shirts.reduce((total, shirt) => {
      return total + 8 * shirt.quantity;
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

  const handleSubmit = async () => {
    console.log("SENDING:", {
      name: customer.name,
      email: customer.email,
      shirts
    });

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
    <div style={{ maxWidth: "650px", margin: "auto", padding: "20px" }}>
      <h1>🏕️ Cooper Campout T-Shirt Order</h1>

      <h3>Submitter Info</h3>

      <input
        placeholder="Name"
        value={customer.name}
        onChange={(e) =>
          setCustomer({ ...customer, name: e.target.value })
        }
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <input
        placeholder="Email"
        value={customer.email}
        onChange={(e) =>
          setCustomer({ ...customer, email: e.target.value })
        }
        style={{ width: "100%", marginBottom: "20px", padding: "8px" }}
      />

      {shirts.map((shirt, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "15px"
          }}
        >
          <h4>Shirt {index + 1}</h4>

          <select
            value={shirt.size}
            onChange={(e) => updateShirt(index, "size", e.target.value)}
          >
            <option>Youth S</option>
            <option>Youth M</option>
            <option>Youth L</option>
            <option>Adult S</option>
            <option>Adult M</option>
            <option>Adult L</option>
            <option>Adult XL</option>
          </select>

          <input
            type="number"
            value={shirt.quantity}
            min="1"
            onChange={(e) =>
              updateShirt(index, "quantity", parseInt(e.target.value) || 1)
            }
          />
        </div>
      ))}

      <button onClick={addShirt}>Add Shirt</button>

      <h2>Total: ${total}</h2>

      <button onClick={handleSubmit}>Pay & Submit</button>
    </div>
  );
}
