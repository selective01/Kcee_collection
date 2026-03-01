import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/checkout.css";

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    postalCode: "",
  });

  const [shipping] = useState(0);
  const [orderLoading, setOrderLoading] = useState(false);
  const grandTotal = subtotal + shipping;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      alert("Please log in to checkout.");
      navigate("/auth");
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    const { fullName, email, phone, address, country, state } = formData;
    if (!fullName || !email || !phone || !address || !country || !state) {
      alert("Please fill in all required fields before proceeding.");
      return false;
    }
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return false;
    }
    return true;
  };

  const handleSuccess = async (reference) => {
    try {
      setOrderLoading(true);
      console.log("1. handleSuccess called with ref:", reference);

      await fetch(`${import.meta.env.VITE_API_URL}/api/paystack/verify/${reference}`);
      console.log("2. Verify done");

      const token = localStorage.getItem("token");
      console.log("3. Token:", token ? "found" : "missing");

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item._id || item.id,
            name: item.name,
            image: item.image,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: grandTotal,
          paymentStatus: "Paid",
          reference,
          customer: formData,
        }),
      });

      console.log("4. Order response status:", orderRes.status);

      if (!orderRes.ok) {
        const err = await orderRes.json();
        console.error("5. Order save failed:", err);
        alert("Payment received but order could not be saved. Please contact support.");
        return;
      }

      console.log("6. Order saved, navigating...");
      clearCart();
      console.log("7. About to navigate to /order-success");
      navigate("/order-success");
    } catch (error) {
      console.error("handleSuccess error:", error);
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePayment = () => {
  console.log("handlePayment called");
  if (!isFormValid()) return;

  if (!window.PaystackPop) {
    alert("Payment system is still loading. Please try again.");
    return;
  }

  const handler = new window.PaystackPop();
  handler.newTransaction({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: formData.email,
    amount: grandTotal * 100,
    currency: "NGN",
    ref: `T${Date.now()}`,
    metadata: {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
    },
    onSuccess: (transaction) => {
      const ref = transaction.reference || transaction.trxref;
      handleSuccess(ref);
    },
    onCancel: () => {
      alert("Payment cancelled.");
    },
  });
};

  return (
    <section className="checkout-section">
      <div className="checkout-container">

        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2>Contact Information</h2>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" placeholder="Enter your email address"
              value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type="text" name="phone" placeholder="Enter your phone number"
              value={formData.phone} onChange={handleChange} />
          </div>

          <h2>Shipping Address</h2>

          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="fullName" placeholder="Enter your full name"
              value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input type="text" name="address" placeholder="Your current home address"
              value={formData.address} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input type="text" name="state" placeholder="Your current city"
              value={formData.state} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input type="text" name="country" placeholder="Your country"
                value={formData.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Postal Code:</label>
              <input type="text" name="postalCode"
                value={formData.postalCode} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h2>Your Order</h2>

          {cartItems.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="order-left">
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="product-name">{item.name}</p>
                  <p className="product-meta">{item.size} × {item.quantity}</p>
                </div>
              </div>
              <p className="price">₦{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}

          <div className="order-summary">
            <p>Subtotal <span>₦{subtotal.toLocaleString()}</span></p>
            <p>Shipping <span>₦{shipping.toLocaleString()}</span></p>
            <hr />
            <h3>Total <span>₦{grandTotal.toLocaleString()}</span></h3>
          </div>

          <button
            className="place-order-btn"
            onClick={handlePayment}
            disabled={orderLoading}
          >
            {orderLoading ? "Processing..." : "Place Order"}
          </button>
        </div>

      </div>
    </section>
  );
}
