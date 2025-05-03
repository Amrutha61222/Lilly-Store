import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

function Account() {
    const user = auth.currentUser;  // Use the imported `auth` here
    const [userData, setUserData] = useState({ name: "", email: "", dob: "", gender: "" });

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        };
        fetchData();
    }, [user]);

    const handleChange = (e) => {
        setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        if (user) {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, userData);
            alert("Account updated!");
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">My Account</h2>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" name="name" value={userData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">Email (read-only)</label>
                <input className="form-control" value={userData.email} readOnly />
            </div>
            <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input className="form-control" type="date" name="dob" value={userData.dob} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={userData.gender} disabled>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>
            <button className="btn btn-success" onClick={handleUpdate}>
                Update Account
            </button>
        </div>
    );
}

export default Account;
