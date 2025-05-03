import React, { useState } from "react";
import axios from "axios";

const ImageUploader = ({ onUpload }) => {
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState("");

    const handleUpload = async () => {
        if (!imageFile) return;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "unsigned_preset"); // replace with your preset name

        setUploading(true);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
                formData
            );

            const imageUrl = response.data.secure_url;
            setUploadedUrl(imageUrl);
            onUpload(imageUrl); // callback to send URL to parent (e.g., to save in Firestore)

        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
            </button>

            {uploadedUrl && (
                <div>
                    <p>Uploaded:</p>
                    <img src={uploadedUrl} alt="Uploaded" style={{ width: 200 }} />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
