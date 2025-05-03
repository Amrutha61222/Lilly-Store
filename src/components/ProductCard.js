import React from "react";

const ProductCard = ({ product, handleAddToCart }) => {
    return (
        <div className="card mb-4 shadow-sm border-primary">
            <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">₹{product.price}</p>
                <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
