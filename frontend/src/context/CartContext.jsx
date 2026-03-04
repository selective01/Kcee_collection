import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const CartContext = createContext();
const BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem("token");

const fetchCartFromDB = async () => {
  const token = getToken();
  if (!token) return [];
  try {
    const res = await fetch(`${BASE_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Failed to fetch cart:", err);
    return [];
  }
};

const saveCartToDB = async (items) => {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
};

const clearCartInDB = async () => {
  const token = getToken();
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/api/cart`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("Failed to clear cart in DB:", err);
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const prevTokenRef = useRef(getToken());
  const isMounted = useRef(true);

  // On app load — fetch cart if token exists
  useEffect(() => {
    isMounted.current = true;
    if (getToken()) {
      fetchCartFromDB().then((items) => {
        if (isMounted.current) setCartItems(items);
      });
    }
    return () => { isMounted.current = false; };
  }, []);

  // Watch for login/logout via token changes
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getToken();
      const prevToken = prevTokenRef.current;

      if (currentToken && !prevToken) {
        prevTokenRef.current = currentToken;
        fetchCartFromDB().then((items) => {
          if (isMounted.current) setCartItems(items);
        });
      } else if (!currentToken && prevToken) {
        prevTokenRef.current = null;
        setCartItems([]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Add item to cart
  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id && item.size === product.size
      );
      const updated = existing
        ? prev.map((item) =>
            item.id === product.id && item.size === product.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];

      saveCartToDB(updated);
      return updated;
    });

    setToastMessage(`${product.name} added to cart!`);
    setTimeout(() => setToastMessage(""), 3000);
  }, []);

  // Remove item
  const removeFromCart = useCallback((id, size) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => !(item.id === id && item.size === size));
      saveCartToDB(updated);
      return updated;
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((id, size, quantity) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      );
      saveCartToDB(updated);
      return updated;
    });
  }, []);

  // Clear cart (called after order placed)
  const clearCart = useCallback(() => {
    setCartItems([]);
    clearCartInDB();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
