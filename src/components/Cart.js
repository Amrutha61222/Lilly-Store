import React from "react";

function Cart({ cart, removeFromCart }) {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);  // Adjust total price calculation

    const handleCheckout = () => {
        alert("Proceeding to checkout...");
    };

    return (
        <div className="container">
            <h1 className="my-4">Your Cart</h1>
            <div className="list-group">
                {cart.map((item) => (
                    <div className="list-group-item" key={item.id}>
                        <div className="d-flex align-items-center">
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "15px" }}
                            />
                            <div>
                                <h5>{item.name}</h5>
                                <p>${item.price} x {item.quantity}</p>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => removeFromCart(item.id)}  // Trigger the remove from cart functionality
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <h3>Total: ${totalPrice}</h3>
            <button className="btn btn-success" onClick={handleCheckout}>
                Checkout
            </button>
        </div>
    );
}

export default Cart;
