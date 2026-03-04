import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ color: "green", fontSize: "2rem" }}>Order Placed Successfully!</h1>
      <p style={{ margin: "20px 0", fontSize: "1.1rem" }}>
        Thank you for your purchase. Your order has been received and is being processed.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          backgroundColor: "#3A9D23",
          color: "#fff",
          padding: "12px 30px",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          borderRadius: "4px",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}