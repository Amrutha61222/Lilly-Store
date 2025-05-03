import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard"; // Assuming this is the correct path
import "bootstrap/dist/css/bootstrap.min.css";

function Home({ addToCart }) {
    const [products, setProducts] = useState([]);
    const [cartConfirmation, setCartConfirmation] = useState(null);

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

    const handleAddToCart = (product) => {
        addToCart(product);
        setCartConfirmation("Added to Cart!");
        setTimeout(() => setCartConfirmation(null), 1500);
    };

    // Filter products by category (Summer or Cotton)
    const cottonProducts = products.filter(product => product.category === "cotton");
    const summerProducts = products.filter(product => product.category === "summer");

    // Cloudinary image URLs for the carousel
    const carouselImages = [
        "https://res.cloudinary.com/dcnueldxx/image/upload/v1746253748/LillyFashion.jpg",
        "https://res.cloudinary.com/dcnueldxx/image/upload/v1746254352/SummerSale.jpg",
        "https://res.cloudinary.com/dcnueldxx/image/upload/v1746256198/CottonTees.jpg"
    ];

    return (
        <div className="container-fluid p-0">
            {/* Carousel */}
            <div id="carouselExample" className="carousel slide mb-4" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {carouselImages.map((image, index) => (
                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                            {/* Wrap each slide with Link to the respective page */}
                            {index === 1 ? (
                                <Link to="/summer-sale">
                                    <img
                                        src={image}
                                        className="d-block w-100"
                                        alt={`Slide ${index + 1}`}
                                        style={{ objectFit: "cover", height: "500px" }}
                                    />
                                </Link>
                            ) : index === 2 ? (
                                <Link to="/cotton-tees">
                                    <img
                                        src={image}
                                        className="d-block w-100"
                                        alt={`Slide ${index + 1}`}
                                        style={{ objectFit: "cover", height: "500px" }}
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={image}
                                    className="d-block w-100"
                                    alt={`Slide ${index + 1}`}
                                    style={{ objectFit: "cover", height: "500px" }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev"
                    style={{
                        filter: "invert(0.5)", // Light gray arrows
                    }}
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next"
                    style={{
                        filter: "invert(0.5)", // Light gray arrows
                    }}
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Display confirmation message */}
            {cartConfirmation && (
                <div
                    className="alert alert-success"
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        zIndex: 999,
                        opacity: cartConfirmation ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                    }}
                >
                    {cartConfirmation}
                </div>
            )}

            {/* Featured Products Section */}
            <div className="container my-5">
                <h2 className="text-center mb-4">Featured Products</h2>
                <div className="row">
                    {/* Show 2 products from Summer */}
                    {summerProducts.slice(0, 2).map((product) => (
                        <div key={product.id} className="col-md-3">
                            <ProductCard product={product} handleAddToCart={handleAddToCart} />
                        </div>
                    ))}

                    {/* Show 2 products from Cotton */}
                    {cottonProducts.slice(0, 2).map((product) => (
                        <div key={product.id} className="col-md-3">
                            <ProductCard product={product} handleAddToCart={handleAddToCart} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;
