import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const total = params.get("total");
    const shirts = JSON.parse(decodeURIComponent(params.get("shirts") || "[]"));

    setOrder({ name, total, shirts });
  }, []);

  if (!order) return null;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >
      <h1>✅ Order Submitted Successfully!</h1>

      <p style={{ marginTop: "10px" }}>
        Thank you, <strong>{order.name}</strong>!
      </p>

      <h3 style={{ marginTop: "30px" }}>Order Summary</h3>

      {order.shirts.map((shirt, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "5px"
          }}
        >
          <strong>Shirt {index + 1}</strong>

          <div>Size: {shirt.size}</div>
          <div>Type: {shirt.type}</div>

          {shirt.isTall && <div>Tall: Yes</div>}
          {shirt.personalizationName && (
            <div>Name: {shirt.personalizationName}</div>
          )}
          {shirt.personalizationNumber && (
            <div>Number: {shirt.personalizationNumber}</div>
          )}
          {shirt.personalizationWings && <div>Angel Wings: Yes</div>}
          <div>Quantity: {shirt.quantity}</div>
        </div>
      ))}

      <h2>Total: ${order.total}</h2>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "30px",
          padding: "12px",
          width: "100%",
          background: "black",
          color: "white",
          fontWeight: "bold"
        }}
      >
        Submit Another Order
      </button>
    </div>
  );
}
``
