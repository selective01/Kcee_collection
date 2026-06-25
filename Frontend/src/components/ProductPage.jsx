// components/ProductPage.jsx — uses shared global cache
import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useAuth } from "../context/useAuth";
import { useWishlist } from "../context/WishlistContext";
import { fetchCategory } from "../utils/productCache";
import SEO from "./SEO";
import "../assets/css/productpage.css";

const ALL_CATEGORIES = [
  "Bags", "Caps", "ClubJersey", "DesignerShirts", "Hoodies",
  "Jeans", "JeanShorts", "Joggers", "LongSleeve", "Perfume", "Polo",
  "RetroJersey", "Shoes", "Shorts", "Sleeveless", "Slippers",
  "Sneakers", "TShirts", "Watches"
];

const CATEGORY_LABELS = {
  ClubJersey:     "Club Jersey",
  DesignerShirts: "Designer Shirts",
  JeanShorts:     "Jean Shorts",
  LongSleeve:     "Long Sleeve",
  RetroJersey:    "Retro Jersey",
};

const NUMBER_SIZES = ["32", "34", "36", "38", "39", "40", "41", "42", "43", "44", "45"];

const CATEGORY_SIZES = {
  TShirts:        ["S", "M", "L", "XL", "XXL"],
  Polo:           ["S", "M", "L", "XL", "XXL"],
  Hoodies:        ["S", "M", "L", "XL", "XXL"],
  Sleeveless:     ["S", "M", "L", "XL", "XXL"],
  ClubJersey:     ["S", "M", "L", "XL", "XXL"],
  RetroJersey:    ["S", "M", "L", "XL", "XXL"],
  DesignerShirts: ["S", "M", "L", "XL", "XXL"],
  LongSleeve:     ["S", "M", "L", "XL", "XXL"],
  Jeans:          ["32", "34", "36", "38", "40"],
  Shorts:         ["32", "34", "36", "38", "40"],
  JeanShorts:     ["32", "34", "36", "38", "40"],
  Joggers:        ["32", "34", "36", "38", "40"],
  Sneakers:       ["39", "40", "41", "42", "43", "44", "45"],
  Shoes:          ["39", "40", "41", "42", "43", "44", "45"],
  Slippers:       ["39", "40", "41", "42", "43", "44", "45"],
  // Bags, Caps, Watches, Perfume — no sizes
};

const label = (cat) => CATEGORY_LABELS[cat] || cat;

function SkeletonCard() {
  return (
    <div className="pp-card pp-card--skeleton">
      <div className="pp-card-img-wrap">
        <div className="pp-skeleton-img" />
      </div>
      <div className="pp-card-body">
        <div className="pp-skeleton-line" style={{ width: "65%", height: 14 }} />
        <div className="pp-skeleton-line" style={{ width: "40%", height: 14, marginTop: 6 }} />
      </div>
    </div>
  );
}

function WishlistHeart({ productId }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(productId);
  return (
    <button
      className={`pp-wishlist-btn ${wishlisted ? "pp-wishlist-btn--active" : ""}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(productId); }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <i className={wishlisted ? "fas fa-heart" : "far fa-heart"} />
    </button>
  );
}

export default function ProductPage({
  category, title, description, seoUrl,
}) {
  const { addToCart } = useCart();
  const { user }      = useAuth();
  const location      = useLocation();
  const isLoggedIn    = !!user;
  const tabsRef       = useRef(null);

  const [activeTab,      setActiveTab]      = useState(category);
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [selectedSizes,  setSelectedSizes]  = useState({});
  const [hoveredId,      setHoveredId]      = useState(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    const idx = ALL_CATEGORIES.indexOf(activeTab);
    const next = ALL_CATEGORIES.slice(idx + 1, idx + 4);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => {
        next.forEach((cat) => fetchCategory(cat).catch(() => {}));
      });
      return () => cancelIdleCallback(id);
    } else {
      const t = setTimeout(() => {
        next.forEach((cat) => fetchCategory(cat).catch(() => {}));
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;
    fetchCategory(activeTab)
      .then((data) => { if (!cancelled) { setProducts(data); setLoading(false); } })
      .catch((err)  => { if (!cancelled) { setError(err.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [activeTab]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setActiveTab(category);
    setSelectedSizes({});
  }, [category]);

  const handleTabClick = (cat) => {
    setActiveTab(cat);
    setSelectedSizes({});
    setLoading(true);
    setError("");
  };

  const handleSizeSelect = (id, size) =>
    setSelectedSizes((p) => ({ ...p, [id]: size }));

  const handleAddToCart = (product) => {
    const activeSizes = CATEGORY_SIZES[activeTab];
    if (activeSizes) {
      const s = selectedSizes[product._id];
      if (!s) { alert("Please select a size"); return; }
      addToCart({ ...product, id: product._id, size: s });
    } else {
      addToCart({ ...product, id: product._id });
    }
  };

  const retry = () => {
    setError("");
    setLoading(true);
    fetchCategory(activeTab)
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((err)  => { setError(err.message); setLoading(false); });
  };

  const activeSizes = CATEGORY_SIZES[activeTab];

  return (
    <>
      <SEO
        title={title} description={description}
        image="https://Kcee_Collection.com/og-image.jpg"
        url={`https://Kcee_Collection.com${seoUrl}`}
      />
      <section className="pp-section">
        <div className="pp-header">
          <p className="pp-eyebrow">Our Collections</p>
          <h2 className="pp-title">Shop by Category</h2>
          <p className="pp-sub">{description}</p>
        </div>

        <div className="pp-tabs-outer">
          <div className="pp-tabs-wrap" ref={tabsRef} onScroll={checkScroll}>
            <div className="pp-tabs">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`pp-tab ${activeTab === cat ? "pp-tab--active" : ""}`}
                  onClick={() => handleTabClick(cat)}
                  onMouseEnter={() => fetchCategory(cat).catch(() => {})}
                >
                  {label(cat)}
                </button>
              ))}
            </div>
          </div>
          {canScrollRight && (
            <div className="pp-scroll-indicator" aria-hidden="true">›</div>
          )}
        </div>

        {error ? (
          <div className="pp-error">
            <p>{error}</p>
            <button className="pp-retry-btn" onClick={retry}>Try Again</button>
          </div>
        ) : (
          <div className="pp-grid">
            {loading
              ? Array.from({ length: 8 }, (_, i) => <SkeletonCard key={i} />)
              : products.length === 0
              ? <p className="pp-empty">No products found in this category.</p>
              : products.map((product) => (
                <div
                  key={product._id}
                  className="pp-card"
                  onMouseEnter={() => setHoveredId(product._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="pp-rating">
                    <span className="pp-star">★</span> 4.9/5.0
                  </div>

                  <div className="pp-card-img-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="pp-img"
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                    />
                    <WishlistHeart productId={product._id} />
                    {isLoggedIn ? (
                      <button
                        className={`pp-add-overlay ${hoveredId === product._id ? "pp-add-overlay-visible" : ""}`}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add To Cart &nbsp;<i className="fas fa-shopping-cart" />
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        state={{ from: location }}
                        className={`pp-add-overlay ${hoveredId === product._id ? "pp-add-overlay-visible" : ""}`}
                      >
                        Login to Buy
                      </Link>
                    )}
                  </div>

                  <div className="pp-card-body">
                    <div className="pp-card-info">
                      <p className="pp-card-name">{product.name}</p>
                      <p className="pp-card-price">₦{product.price.toLocaleString()}</p>
                    </div>

                    {activeSizes && (
                      <div className="pp-sizes">
                        {activeSizes.map((size) => (
                          <span
                            key={size}
                            className={`pp-size ${NUMBER_SIZES.includes(size) ? "pp-size-shoe" : ""} ${selectedSizes[product._id] === size ? "pp-size-active" : ""}`}
                            onClick={() => handleSizeSelect(product._id, size)}
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    )}

                    {isLoggedIn ? (
                      <button className="pp-add-btn-mobile" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                    ) : (
                      <Link to="/auth" state={{ from: location }} className="pp-add-btn-mobile">
                        Login to Buy
                      </Link>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </section>
    </>
  );
}
