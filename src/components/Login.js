import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Loading from './Loading'; // Import your Loading component

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        gender: "",
        dob: "",
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Form validation function
    const validateForm = () => {
        if (!form.email || !form.password) {
            return "Email and Password are required.";
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(form.email)) {
            return "Please enter a valid email address.";
        }

        // Password validation for strength (at least 8 characters, and includes both letters and numbers)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (form.password && !passwordRegex.test(form.password)) {
            return "Password must be at least 7 characters long and contain a number.";
        }

        // If we're registering, check the additional fields
        if (isRegistering && (!form.name || !form.gender || !form.dob)) {
            return "All fields are required for registration.";
        }

        return null; // No error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validate the form
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
        }

        try {
            if (isRegistering) {
                const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    name: form.name,
                    dob: form.dob,
                    email: form.email,
                    gender: form.gender,
                    isAdmin: false, // Default role
                });
            } else {
                await signInWithEmailAndPassword(auth, form.email, form.password);
            }

            setTimeout(() => {
                setIsLoading(false);
                navigate("/");
            }, 500);
        } catch (error) {
            console.log(error); // Log the entire error object to check the structure
            setIsLoading(false);

            if (error.code === "auth/user-not-found") {
                setError("Account does not exist. Please register first.");
            } else if (error.code === "auth/invalid-credential") {
                setError("Invalid credentials. Please try again.");
            } else if (error.code === "auth/network-request-failed") {
                setError("Please check your network and try again.");
            } else {
                setError("Error: " + error.message);
            }
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card mx-auto w-50 w-md-50 rounded-4 shadow-lg position-relative">
                <div className="card-body">
                    <h2 className="text-center mb-4">
                        {isRegistering ? "Register" : "Login"}
                    </h2>

                    {error && <p className="text-center text-danger">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        {isRegistering && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={form.dob}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        required
                                        className="form-select"
                                    >
                                        <option value="">Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`btn w-100 ${isRegistering ? "btn-info" : "btn-primary"} ${isLoading ? "disabled" : ""}`}
                            disabled={isLoading}
                        >
                            {isRegistering ? "Register" : "Login"}
                        </button>
                    </form>

                    <p className="mt-3 text-center text-muted">
                        {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            type="button"
                            className="btn btn-link text-primary"
                            onClick={() => setIsRegistering(!isRegistering)}
                        >
                            {isRegistering ? "Login" : "Register"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
