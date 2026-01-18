const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const storageService = {
    uploadBase64Image: async (imageInput) => {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            throw new Error("Missing Cloudinary credentials in .env");
        }

        const formData = new FormData();
        formData.append("file", imageInput);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Upload failed");
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            // Fallback: If upload fails (e.g. Cloudinary blocked from fetching Pollinations), 
            // return the input URL itself if it is a valid URL.
            if (typeof imageInput === 'string' && imageInput.startsWith('http')) {
                console.warn("Falling back to original URL due to upload failure.");
                return imageInput;
            }
            throw error;
        }
    }
};
