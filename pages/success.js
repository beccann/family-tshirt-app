export default function SuccessPage() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "auto",
        padding: "40px",
        textAlign: "center",
        fontFamily: "Arial"
      }}
    >
      <h1>✅ Order Submitted Successfully!</h1>

      <p style={{ fontSize: "18px", marginTop: "20px" }}>
        Thank you! Your order has been received and your payment was successful.
      </p>

      <p style={{ marginTop: "10px" }}>
        You will receive your shirts at the Cooper Campout.
      </p>

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          fontSize: "16px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Submit Another Order
      </button>
    </div>
  );
}
