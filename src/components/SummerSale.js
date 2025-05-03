import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";

const SummerSale = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("lowToHigh");

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "products"));
            const fetchedProducts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(fetchedProducts);
        };
        fetchProducts();
    }, []);

    const handleSort = (e) => {
        setSort(e.target.value);
    };

    const filteredAndSortedProducts = products
        .filter(
            (product) =>
                product.category === "summer" &&
                product.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sort === "lowToHigh") {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });

    return (
        <div className="container mt-4">
            <h2>Summer Sale</h2>
            <div className="d-flex justify-content-between mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search products"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "300px" }}
                />
                <select
                    className="form-control"
                    onChange={handleSort}
                    value={sort}
                    style={{ width: "200px" }}
                >
                    <option value="lowToHigh">Price: Low to High</option>
                    <option value="highToLow">Price: High to Low</option>
                </select>
            </div>

            <div className="row">
                {filteredAndSortedProducts.map((product) => (
                    <div key={product.id} className="col-md-4">
                        <ProductCard product={product} handleAddToCart={addToCart} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SummerSale;
