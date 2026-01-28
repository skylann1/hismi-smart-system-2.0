// Client-side helper function to upload images via API
export async function uploadImageViaAPI(file: File, folder: string = "uploads") {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/dashboard/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Upload failed");
        }

        return { success: true, url: result.url };
    } catch (error) {
        console.error("Error uploading image:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed",
        };
    }
}
