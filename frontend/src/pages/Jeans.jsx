import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SEO from "../components/SEO";

const BASE_URL = import.meta.env.VITE_API_URL;

const Jeans = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const SIZE_OPTIONS = [32, 33, 34, 36, 38, 40];
  const SIZE_CLASS = "size-option-shoe";

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/category/Jeans`)
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSizeSelect = (productId, size) =>
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    if (!selectedSize) { alert("Please select a size"); return; }
    addToCart({ ...product, id: product._id, size: selectedSize });
  };

  return (
    <>
      <SEO
        title="Jeans"
        description="Shop Luxury Streetwear Jeans at Kcee Collection."
        image="https://kceecollection.com/og-image.jpg"
        url="https://kceecollection.com/jeans"
      />
      <section className="premium-categories product-page">
        <div className="section-header">
          <h2>Jeans</h2>
          <p>Luxury Streetwear Jeans</p>
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
                  <div className="size-selector">
                    {SIZE_OPTIONS.map((size) => (
                      <span
                        key={size}
                        className={`size-option-shoe ${selectedSizes[product._id] === size ? "active" : ""}`}
                        onClick={() => handleSizeSelect(product._id, size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
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

export default Jeans;