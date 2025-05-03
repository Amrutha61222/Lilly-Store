import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";  // Import Footer
import AdminPanel from "./components/AdminPanel";
import RequireAdmin from "./components/RequireAdmin";
import About from "./components/AboutUs";
import Contact from "./components/Contact";
import Account from "./components/Account";
import CottonTees from "./components/CottonTees";
import SummerSale from "./components/SummerSale";
import SearchResults from "./components/SearchResults";

function App() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);

      if (productExists) {
        // If the product already exists in the cart, increment the quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Otherwise, add the product with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar setFilteredProducts={setFilteredProducts} />
        <div className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={<Home filteredProducts={filteredProducts} addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} removeFromCart={removeFromCart} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults addToCart={addToCart} />} />
            <Route path="/cotton-tees" element={<CottonTees addToCart={addToCart} />} />
            <Route path="/summer-sale" element={<SummerSale addToCart={addToCart} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
