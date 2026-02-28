import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminProducts() {
  const { user } = useAuth(); // ensure admin is logged in
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/products`, formData);
      setFormData({ name: "", price: 0, description: "", image: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Open modal with selected product
  const openEditModal = (product) => {
    setEditProduct(product);
    setIsEditModalOpen(true);
  };

  // Close modal
  const closeEditModal = () => {
    setEditProduct(null);
    setIsEditModalOpen(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/products/${editProduct._id}`, editProduct);
      closeEditModal();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <h1>Manage Products</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Create Product Form */}
      <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          required
          onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <button type="submit">Create Product</button>
      </form>

      {/* Product Table */}
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5}>No products found</td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>₦{p.price.toLocaleString()}</td>
                <td>{p.description}</td>
                <td>
                  {p.image && (
                    <img src={p.image} alt={p.name} width="50" height="50" />
                  )}
                </td>
                <td>
                  <button onClick={() => openEditModal(p)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Edit Product</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editProduct.name}
                required
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />
              <input
                type="number"
                value={editProduct.price}
                required
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: +e.target.value })
                }
              />
              <input
                type="text"
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, description: e.target.value })
                }
              />
              <input
                type="text"
                value={editProduct.image}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, image: e.target.value })
                }
              />
              <button type="submit">Save</button>
              <button type="button" onClick={closeEditModal} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}