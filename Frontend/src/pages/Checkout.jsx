import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import "../assets/css/checkout.css";

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
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
  const grandTotal = subtotal + shipping;

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ After Successful Payment
  const handleSuccess = async (reference) => {
    try {
      // Verify payment on backend
      await fetch(
        `http://localhost:5000/api/paystack/verify/${reference.reference}`
      );

      clearCart();
      navigate("/cart"); // redirect to cart
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Paystack Config
  const paystackConfig = {
    email: formData.email,
    amount: grandTotal * 100, // convert to kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    metadata: {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
    },
    text: "Place Order",
    onSuccess: handleSuccess,
    onClose: () => alert("Payment cancelled"),
  };

  return (
    <section className="checkout-section">
      <div className="checkout-container">

        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2>Contact Information</h2>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <h2>Shipping Address</h2>

          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              placeholder="Your current home address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              name="state"
              placeholder="Your current city"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Your country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Postal Code:</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
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
                  <p className="product-meta">
                    {item.size} × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="price">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}

          <div className="order-summary">
            <p>Subtotal <span>₦{subtotal.toLocaleString()}</span></p>
            <p>Shipping <span>₦{shipping.toLocaleString()}</span></p>
            <hr />
            <h3>Total <span>₦{grandTotal.toLocaleString()}</span></h3>
          </div>

          <PaystackButton
            {...paystackConfig}
            className="place-order-btn"
          />
        </div>

      </div>
    </section>
  );
}