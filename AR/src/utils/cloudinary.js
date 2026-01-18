import axios from 'axios';

const CLOUD_NAME = "deyr71owo";
const UPLOAD_PRESET = "O-ARapp";

// Cloudinary Free Tier limit is 10MB. We need chunked upload for larger files.
// However, 'auto/upload' doesn't support chunked directly easily without signature.
// Strategy: We will use the standard upload but we must warn the user if file is > 10MB
// because unsigned chunked uploads are complex. 
// ACTUALLY: Let's try to increase the limit via specific resource type 'raw' which might have different limits, 
// OR simply catch the error and tell user to compress.
// Based on error: "File size too large. Got 15641684. Maximum is 10485760." (10MB)

export const uploadToCloudinary = async (file) => {
    // Check size client side to fail fast
    if (file.size > 10485760) { // 10MB in bytes
        throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Free tier limit is 10MB. Please compress your GLB file.`);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
            formData
        );
        return response.data;
    } catch (error) {
        console.error("Cloudinary upload failed full error:", error);
        if (error.response && error.response.data && error.response.data.error) {
            throw new Error(error.response.data.error.message);
        }
        throw error;
    }
};
