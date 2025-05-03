import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaShoppingCart, FaTh } from "react-icons/fa";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser(userData.name);
                    } else {
                        setUser(currentUser.email);
                    }
                    setIsLoggedIn(true);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(currentUser.email);
                    setIsLoggedIn(true);
                }
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Error logging out: ", error.message);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.trim() !== "") {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand text-white" to="/">Lilly-Store</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/cotton-tees">
                                <FaTh size={20} className="me-2" /> Cotton Tees
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/summer-sale">
                                <FaTh size={20} className="me-2" /> Summer Sale
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contact</Link>
                        </li>
                    </ul>

                    <form className="d-flex mx-auto" style={{ width: "300px" }} onSubmit={handleSearchSubmit}>
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search Products"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>

                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item d-flex align-items-center" style={{ marginRight: '15px' }}>
                            <Link className="nav-link" to="/cart">
                                <FaShoppingCart size={20} />
                            </Link>
                        </li>
                        <li className="nav-item d-flex align-items-center">
                            {isLoggedIn ? (
                                <div className="d-flex align-items-center">
                                    <Link to="/account" className="me-2 text-white text-decoration-underline">
                                        {user}
                                    </Link>
                                    <button className="btn btn-sm btn-outline-light ms-2" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link className="nav-link" to="/login">
                                    <FaUserCircle size={20} />
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
