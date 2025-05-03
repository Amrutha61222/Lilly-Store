import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "./ProductCard";

const SearchResults = ({ addToCart }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

    useEffect(() => {
        const fetchAndFilter = async () => {
            const snapshot = await getDocs(collection(db, "products"));
            const allProducts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const filtered = allProducts.filter((product) =>
                product.name.toLowerCase().includes(query)
            );
            setResults(filtered);
            setLoading(false);
        };

        fetchAndFilter();
    }, [query]);

    return (
        <div className="container mt-4">
            <h2>Search Results for "{query}"</h2>
            {loading ? (
                <p>Loading...</p>
            ) : results.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="row">
                    {results.map((product) => (
                        <div key={product.id} className="col-md-4">
                            <ProductCard product={product} handleAddToCart={addToCart} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
