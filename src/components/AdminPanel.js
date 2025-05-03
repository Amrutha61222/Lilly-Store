import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const CLOUD_NAME = "dcnueldxx";
const UPLOAD_PRESET = "unsigned_preset"; // Use your unsigned preset

function AdminPanel() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "", // New category field
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProducts(data);
    };

    const handleDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            setForm((prev) => ({ ...prev, image: res.data.secure_url }));
        } catch (err) {
            setError("Image upload failed: " + err.message);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: "image/*",
    });

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, price, image, category } = form;

        if (!name || !description || !price || !image || !category) {
            setError("All fields are required.");
            return;
        }

        try {
            if (editingId) {
                await updateDoc(doc(db, "products", editingId), {
                    name,
                    description,
                    price: parseFloat(price),
                    image,
                    category, // Include category in the update
                });
                setSuccess("Product updated!");
            } else {
                await addDoc(collection(db, "products"), {
                    name,
                    description,
                    price: parseFloat(price),
                    image,
                    category, // Include category when adding a new product
                });
                setSuccess("Product added!");
            }

            setForm({ name: "", description: "", price: "", image: "", category: "" });
            setEditingId(null);
            setError("");
            fetchProducts();
        } catch (err) {
            setError("Error: " + err.message);
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditingId(product.id);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h1 className="my-4">{editingId ? "Edit Product" : "Admin Panel"}</h1>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                />
                <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                />
                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    name="price"
                    value={form.price}
                    onChange={handleInput}
                />

                <div
                    {...getRootProps()}
                    className="form-control mb-2 p-3"
                    style={{
                        border: "2px dashed #ccc",
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                >
                    <input {...getInputProps()} />
                    {form.image ? (
                        <img src={form.image} alt="Preview" style={{ maxWidth: "100px" }} />
                    ) : (
                        <p>Click or drag to upload image</p>
                    )}
                </div>

                <select
                    className="form-control mb-2"
                    name="category"
                    value={form.category}
                    onChange={handleInput}
                >
                    <option value="">Select Category</option>
                    <option value="cotton">Cotton Tees</option>
                    <option value="summer">Summer Sale</option>
                </select>

                <button type="submit" className="btn btn-primary">
                    {editingId ? "Update" : "Add Product"}
                </button>
            </form>

            <hr />
            <input
                className="form-control mb-3"
                placeholder="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="row">
                {filteredProducts.map((product) => (
                    <div className="col-md-4 mb-3" key={product.id}>
                        <div className="card h-100">
                            <img
                                src={product.image}
                                className="card-img-top"
                                alt={product.name}
                            />
                            <div className="card-body">
                                <h5>{product.name}</h5>
                                <p>{product.description}</p>
                                <p>₹{product.price}</p>
                                <p><strong>Category:</strong> {product.category}</p>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleEdit(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPanel;
