import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const BASE_URL = import.meta.env.VITE_API_URL;

const Bags = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/category/Bags`)
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);


  const handleAddToCart = (product) => {
    addToCart({ ...product, id: product._id });
  };

  return (
    <>
      <SEO
        title="Bags"
        description="Shop Luxury Men's Bags at Kcee Collection."
        image="https://kceecollection.com/og-image.jpg"
        url="https://kceecollection.com/bags"
      />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Bags</h2>
          <p>Luxury Men's Bags</p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px" }}>No products found.</p>
        ) : (
          <div className="categories-grid">
            {products.map((product) => (
              <div key={product._id} className="category-card product-card">
                <div className="image-wrapper">
                  <img src={product.image} alt={product.name} className="product-img" />
                </div>
                <div className="card-info">
                  <h3>{product.name}</h3>
                  <p className="price">₦{product.price.toLocaleString()}</p>
                  <p className="description">{product.description}</p>
                  {isLoggedIn ? (
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </button>
                  ) : (
                    <p className="login-warning">
                      Please <strong><Link to="/auth" state={{ from: location }}>login</Link></strong> to add to cart
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Bags;