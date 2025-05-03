import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const RequireAdmin = ({ children }) => {
    const [checking, setChecking] = useState(true);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists() && userSnap.data().isAdmin) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setChecking(false);
        });

        return () => unsubscribe();
    }, []);

    if (checking) return <p>Loading...</p>;

    if (!isAdmin) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#f8d7da", // light red background for contrast
                }}
            >
                <h1 style={{ color: "#dc3545", fontSize: "4rem", fontWeight: "bold" }}>
                    🚫 Access Denied
                </h1>
            </div>
        );
    }
    return children;
};

export default RequireAdmin;
